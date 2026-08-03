import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { LangChainAdapter } from 'ai';
import { NextResponse } from 'next/server';
import { PostgresCallbackHandler } from '@/utils/chat/postgres-callback';
import { PortfolioRetriever } from '@/utils/chat/retriever';
import { getKnowledgeDocs, type KnowledgeDoc } from '@/utils/chat/knowledge';
import { formatContext } from '@/utils/chat/context';
import { validateChatRequest, toLangChainHistory } from '@/utils/chat/messages';

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
- Never invent process, method, or motivation either. Do not describe research you ran, users you talked to, iterations you made, or problems you set out to solve unless the context states them.
- Length guidance is a ceiling, not a quota. If a project's context is only a one-line description, give that one line honestly, say the full write-up isn't published yet, and offer to talk about a project that has more depth. A short accurate answer is always better than a padded one.

DISAMBIGUATION RULE
- If the visitor asks broadly about my projects or portfolio without naming a specific project or area, do NOT list every project.
- Instead, ask which area they'd like to hear about, and offer exactly these four options, in this order: AI Engineering, UX Research, Product and Design, Industrial Design.
- These four labels correspond exactly to the "categories" slugs shown on each project in the CONTEXT: AI Engineering = ai-engineering, UX Research = ux-research, Product and Design = product-design, Industrial Design = industrial-design. A project belongs to an area only if its categories list contains that exact slug.
- Once they name an area or a specific project (on this turn or a later one), answer using only the projects from the context whose categories include that area's slug, or that specific project.
- If no project in the CONTEXT belongs to the area the visitor chose, say so plainly (you don't have a project from that area to show right now) rather than substituting or describing a project from a different area.
- If the visitor already names a specific project or area up front, skip the question and answer directly.

PROJECT ANSWERS
- Discuss the projects present in the context, and only those.
- Never mention the same project twice in one response.
- Give each project exactly one paragraph with a bold title, covering the problem, the key insight, the approach, and the outcome.
- End each project paragraph with a link built from its slug: [View Project](/projects/SLUG)
- Separate project paragraphs with a blank line.

CONTEXT
{context}`;

export async function POST(request: Request) {
  try {
    // The `ai/react` useChat hook posts the full message list as `messages`.
    const { messages = [], sessionId } = await request.json();

    const validation = validateChatRequest(messages);

    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: validation.status });
    }

    const message = validation.message;

    // Read the knowledge base from disk exactly once per request, then
    // partition in memory. Both getAlwaysOnDocs/getRetrievableDocs and a
    // fresh PortfolioRetriever would each re-read every content file.
    const knowledgeDocs = getKnowledgeDocs();
    const alwaysOnDocs = knowledgeDocs.filter((doc) => doc.kind === 'about');
    const retrievableDocs = knowledgeDocs.filter((doc) => doc.kind !== 'about');

    const retriever = new PortfolioRetriever({ docs: retrievableDocs });
    const retrieved = await retriever.invoke(message);

    // Slugs are only unique within a kind (e.g. a post and a project could
    // both be "ux-research"), so the re-lookup keys on kind+slug. Mapping
    // over `retrieved` (rather than filtering `retrievableDocs`) preserves
    // the retriever's ranking instead of falling back to corpus order.
    const docByKey = new Map<string, KnowledgeDoc>(
      retrievableDocs.map((doc) => [`${doc.kind}:${doc.slug}`, doc])
    );
    const retrievedDocs = retrieved
      .map((doc) => docByKey.get(`${doc.metadata.kind}:${doc.metadata.slug}`))
      .filter((doc): doc is KnowledgeDoc => doc !== undefined);
    const context = formatContext([...alwaysOnDocs, ...retrievedDocs]);

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
    const history = toLangChainHistory(validation.history);

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
