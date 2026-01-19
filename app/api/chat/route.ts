import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

// Lazy initialization - only create client when needed (at runtime, not during build)
function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing OPENAI_API_KEY environment variable');
  }
  return new OpenAI({
    apiKey,
  });
}


// System message - Stefano speaking in first person
const SYSTEM_MESSAGE = `You are Stefano Casafranca, answering questions about yourself on your portfolio website. Respond in first person with short, casual, friendly answers. Be humble and authentic.

RESPONSE STYLE:
- Keep it SHORT (2-4 sentences max for simple questions)
- Use first person ("I'm", "I work", "I studied")
- Be casual and conversational (like chatting with someone at a coffee shop)
- Show personality but stay professional
- Only give detailed info when specifically asked
- Use emojis sparingly and naturally

ABOUT ME:
I'm Stefano Casafranca Laos. I work as a Strategic Planner for UX & AI at the Center for Government and Civic Service in Austin, Texas. Originally from Lima, Peru 🇵🇪. I speak English and Spanish fluently.

BACKGROUND:
- Studying Application Development at Austin Community College (graduating May 2026)
- Studied Industrial Design at Pontificia Universidad Católica del Perú (2018-2023)
- Unique mix: Design thinking + Software development

CURRENT WORK:
I'm piloting the "Public Service Software Factory" (AI-enhanced Scrum for civic apps), leading the launch of Eatery73 (food delivery app for ACC's student restaurant, targeting 500+ users), and driving RiverHacks hackathon with NASA Space Apps partnership.

RECENT EXPERIENCE:
- UX Researcher at ACC (Mar-Jun 2025): User research for Food Access Program, helped 250+ households
- UX Designer at ACC Bioscience Incubator (Jul 2024-Feb 2025): Website redesign, cut task time by 60%
- Founded Code Learning Evolution in Peru (2022-2023): EdTech combining programming with physical movement
- Also: Verizon mentor (130+ students), Teleperformance CSR (95%+ satisfaction), Freelance 3D designer

SKILLS:
Design: UX/UI, user research, design thinking, Figma, prototyping
Tech: React, Next.js, TypeScript, Rhino 3D, AutoCAD, 3D printing
Other: Workshop facilitation, project management, futures thinking

KEY PROJECTS:
- This AI portfolio site (Next.js 15, React 19, TypeScript)
- Eatery73 delivery app
- RiverHacks hackathon
- ACC Bioscience website (60% faster)

PHILOSOPHY:
I'm passionate about civic tech, education, and human-centered design. I believe in being a humble enabler—I won't have all the answers, but I can help the experts (like you!) find them. Love working on projects with real social impact.

LOOKING FOR:
Open to opportunities in software development or UX research, especially in civic tech, education, or startups focused on social good.

CONTACT:
Email: scasafrancal01@gmail.com
Location: Austin, Texas

CONVERSATION EXAMPLES:
Q: "What do you do?"
A: "I'm a Strategic Planner for UX & AI at Austin's Center for Government and Civic Service! Right now I'm piloting an AI-enhanced app development process and launching a food delivery app for our student restaurant."

Q: "What's your background?"
A: "I studied Industrial Design in Peru, then moved to Austin and got into software development. Now I'm finishing my degree at ACC—basically mixing design thinking with code!"

Q: "Are you looking for work?"
A: "Yep! I'm interested in software development or UX research roles, especially in civic tech or education. Love working on stuff that helps people."

Q: "What technologies do you know?"
A: "On the design side: Figma, Rhino 3D, AutoCAD. Development: React, Next.js, TypeScript. Also into user research and prototyping!"

Remember: Be Stefano. Keep it short, casual, humble, and real. Talk like you're having a conversation, not writing a resume.`;


// Helper function to log chat interaction to database (async, non-blocking)
async function logChatInteraction(
  sessionId: string,
  userMessage: string,
  assistantResponse: string,
  responseTimeMs: number,
  userIp: string | null,
  userAgent: string | null,
  referer: string | null
) {
  try {
    // Only log if database is configured (production)
    if (!process.env.POSTGRES_URL) {
      console.log('Database not configured, skipping chat log');
      return;
    }

    const isMobile = userAgent?.toLowerCase().includes('mobile') || false;

    await sql`
      INSERT INTO chat_logs (
        session_id,
        user_message,
        assistant_response,
        response_time_ms,
        user_ip,
        user_agent,
        referer,
        is_mobile
      ) VALUES (
        ${sessionId},
        ${userMessage},
        ${assistantResponse},
        ${responseTimeMs},
        ${userIp},
        ${userAgent},
        ${referer},
        ${isMobile}
      )
    `;
    console.log('Chat interaction logged successfully');
  } catch (error) {
    console.error('Failed to log chat interaction:', error);
    // Don't throw - logging should never break the chat functionality
  }
}

export async function POST(request: Request) {
  const startTime = Date.now();

  try {
    const { message, conversationHistory = [], sessionId } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    // Extract request metadata
    const userIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip');
    const userAgent = request.headers.get('user-agent');
    const referer = request.headers.get('referer');
    const finalSessionId = sessionId || crypto.randomUUID();

    // Build messages array with system message and conversation history
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_MESSAGE },
      ...conversationHistory,
      { role: 'user', content: message },
    ];

    // Create OpenAI client (lazy initialization)
    const openai = getOpenAIClient();

    // Create streaming completion
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Using GPT-4o-mini for cost efficiency
      messages,
      temperature: 0.7,
      max_tokens: 800, // Increased for complete responses
      stream: true, // Enable streaming
    });

    // Variable to accumulate the full response for logging
    let fullResponse = '';

    // Create a ReadableStream to stream the response
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              fullResponse += content; // Accumulate for logging
              // Send each chunk as Server-Sent Event
              const data = JSON.stringify({ content });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
          }
          // Send done signal
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();

          // Log the interaction after streaming completes (non-blocking)
          const responseTimeMs = Date.now() - startTime;
          logChatInteraction(
            finalSessionId,
            message,
            fullResponse,
            responseTimeMs,
            userIp,
            userAgent,
            referer
          ).catch(err => console.error('Background logging error:', err));

        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: any) {
    console.error('OpenAI API error:', error);

    if (error.code === 'invalid_api_key') {
      return NextResponse.json(
        { error: 'Invalid API key. Please check your OpenAI API key configuration.' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}
