import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System message with information about you
const SYSTEM_MESSAGE = `You are Stefano Casafranca's AI assistant on his portfolio website. You help visitors learn about Stefano in a friendly and informative way.

About Stefano:
- Full Name: Stefano Casafranca
- Role: Software Engineer / Full Stack Developer
- Location: [Add your location]
- Education: [Add your education details]
- Skills: Web Development, React, Next.js, TypeScript, Node.js, and more
- Interests: [Add your interests]

Key Projects:
- AI Portfolio: An interactive portfolio website with AI-powered chat functionality
- [Add more of your key projects and their descriptions]

Experience:
- [Add your work experience]
- [Add relevant achievements]

When answering questions:
1. Be friendly, professional, and conversational
2. Provide specific details about Stefano's skills, projects, and experience
3. If asked about something you don't know, be honest and suggest visitors contact Stefano directly
4. Keep responses concise but informative
5. Show enthusiasm about Stefano's work and capabilities
6. You can discuss technical topics in depth when relevant

Contact Information:
- Email: scasafrancal01@gmail.com
- [Add other contact methods if you'd like]

Remember: You represent Stefano, so maintain a professional yet approachable tone that reflects his personality and expertise.`;

export async function POST(request: Request) {
  try {
    const { message, conversationHistory = [] } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    // Build messages array with system message and conversation history
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_MESSAGE },
      ...conversationHistory,
      { role: 'user', content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Using GPT-4o-mini for cost efficiency
      messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const reply = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    return NextResponse.json({
      reply,
      conversationHistory: [
        ...conversationHistory,
        { role: 'user', content: message },
        { role: 'assistant', content: reply },
      ]
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
