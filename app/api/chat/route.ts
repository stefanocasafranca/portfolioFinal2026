import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { AIMessage, HumanMessage } from '@langchain/core/messages';
import { LangChainAdapter } from 'ai';
import { NextResponse } from 'next/server';
import { PostgresCallbackHandler } from '@/utils/chat/postgres-callback';
import { PortfolioRetriever } from '@/utils/chat/retriever';
import { getAlwaysOnDocs, getRetrievableDocs } from '@/utils/chat/knowledge';
import { formatContext } from '@/utils/chat/context';

// System message - Stefano speaking in first person
const SYSTEM_MESSAGE = `You are Stefano Casafranca Laos, answering questions about yourself on your portfolio website. Respond in first person, as if you are casually explaining your work to someone over coffee. Be humble, precise, and authentic. Do not exaggerate, invent experience, or change role titles.

RESPONSE STYLE
- For project-related questions: give detailed responses (5-8 sentences)
- For general questions: keep it conversational (3-5 sentences)
- Always use first person ("I'm", "I worked", "I learned")
- Be warm, thoughtful, and professional
- Use emojis sparingly and naturally (never more than one per response)
- Focus on insights, decisions, challenges, and outcomes
- Avoid listing tools or frameworks unless directly relevant to a UX or research decision

GROUNDING RULES
- Answer ONLY from the CONTEXT below. It is the authoritative source about me.
- If the context does not cover something, say you would rather not speak to it than guess.
- Never invent metrics, dates, employers, or outcomes.
- Never describe yourself as a founder or entrepreneur in UX Research contexts.

PROJECT ANSWERS
- Discuss the projects present in the context, and only those.
- Give each project its own paragraph with a bold title, covering the problem, the key insight, the approach, and the outcome.
- End each project paragraph with a link built from its slug: [View Project](/projects/SLUG)
- Separate project paragraphs with a blank line.

CONTEXT
{context}`;

type ChatMessage = { role: string; content: string };

export async function POST(request: Request) {
  try {
    // The `ai/react` useChat hook posts the full message list as `messages`.
    const { messages = [], sessionId } = await request.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'messages is required and must be a non-empty array' },
        { status: 400 }
      );
    }

    // The latest user turn is the input; everything before it is history.
    const latest = messages[messages.length - 1] as ChatMessage;

    if (latest?.role !== 'user' || typeof latest.content !== 'string' || !latest.content.trim()) {
      return NextResponse.json(
        { error: 'The last message must be a non-empty user message' },
        { status: 400 }
      );
    }

    const message = latest.content;

    // Always-on identity context plus documents retrieved for this question.
    const retriever = new PortfolioRetriever();
    const retrieved = await retriever.invoke(message);
    const retrievedSlugs = new Set(retrieved.map((doc) => doc.metadata.slug as string));
    const retrievedDocs = getRetrievableDocs().filter((doc) => retrievedSlugs.has(doc.slug));
    const context = formatContext([...getAlwaysOnDocs(), ...retrievedDocs]);

    // Extract request metadata
    const userIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip');
    const userAgent = request.headers.get('user-agent');
    const referer = request.headers.get('referer');
    const finalSessionId = sessionId || crypto.randomUUID();

    // Initialize the custom Postgres callback handler
    const postgresHandler = new PostgresCallbackHandler({
      sessionId: finalSessionId,
      userIp,
      userAgent,
      referer,
      userMessage: message,
    });

    // Initialize LangChain ChatOpenAI model with both handlers
    const model = new ChatOpenAI({
      modelName: 'gpt-4o-mini',
      temperature: 0.7,
      openAIApiKey: process.env.OPENAI_API_KEY,
      streaming: true,
      callbacks: [postgresHandler],
    });

    // Create prompt template
    const prompt = ChatPromptTemplate.fromMessages([
      ['system', SYSTEM_MESSAGE],
      new MessagesPlaceholder('history'),
      ['user', '{input}'],
    ]);

    // Prior turns become LangChain messages for the history placeholder.
    const history = (messages.slice(0, -1) as ChatMessage[])
      .filter((msg) => typeof msg?.content === 'string' && msg.content.length > 0)
      .map((msg) =>
        msg.role === 'user' ? new HumanMessage(msg.content) : new AIMessage(msg.content)
      );

    // Create the chain
    const chain = prompt.pipe(model);

    // Stream the response
    const stream = await chain.stream({
      input: message,
      history: history,
      context: context,
    });

    // Convert LangChain stream to Vercel AI SDK compatible stream
    // We don't need onCompletion here because PostgresCallbackHandler handles it
    const aiStream = LangChainAdapter.toDataStreamResponse(stream);

    return aiStream;

  } catch (error: any) {
    console.error('LangChain/OpenAI error:', error);

    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}
