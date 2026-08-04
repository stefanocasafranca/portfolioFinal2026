import { AIMessage, HumanMessage } from '@langchain/core/messages';

export type ChatMessage = { role: string; content: string };

export type ChatRequestValidation =
    | { ok: true; message: string; history: ChatMessage[] }
    | { ok: false; status: number; error: string };

/**
 * Validates the raw `messages` payload from the request body. Pure and
 * side-effect free so the exact 400 status/body pairing the route returns can
 * be unit-tested without mocking the request or the model.
 */
export function validateChatRequest(messages: unknown): ChatRequestValidation {
    if (!Array.isArray(messages) || messages.length === 0) {
        return {
            ok: false,
            status: 400,
            error: 'messages is required and must be a non-empty array',
        };
    }

    const latest = messages[messages.length - 1] as ChatMessage;

    if (latest?.role !== 'user' || typeof latest.content !== 'string' || !latest.content.trim()) {
        return {
            ok: false,
            status: 400,
            error: 'The last message must be a non-empty user message',
        };
    }

    return {
        ok: true,
        message: latest.content,
        history: (messages as ChatMessage[]).slice(0, -1),
    };
}

/**
 * Converts prior chat turns into LangChain message objects for the `history`
 * placeholder. Turns with non-string or empty content are dropped rather than
 * passed through, matching the route's original behavior.
 */
export function toLangChainHistory(history: ChatMessage[]): (HumanMessage | AIMessage)[] {
    return history
        .filter((msg) => typeof msg?.content === 'string' && msg.content.length > 0)
        .map((msg) => (msg.role === 'user' ? new HumanMessage(msg.content) : new AIMessage(msg.content)));
}
