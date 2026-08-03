import { describe, it, expect } from 'vitest';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import { validateChatRequest, toLangChainHistory } from '@/utils/chat/messages';

describe('validateChatRequest', () => {
    it('rejects a non-array messages payload with the exact route.ts 400 body', () => {
        const result = validateChatRequest(undefined);
        expect(result).toEqual({
            ok: false,
            status: 400,
            error: 'messages is required and must be a non-empty array',
        });
    });

    it('rejects an empty messages array with the exact route.ts 400 body', () => {
        const result = validateChatRequest([]);
        expect(result).toEqual({
            ok: false,
            status: 400,
            error: 'messages is required and must be a non-empty array',
        });
    });

    it('rejects when the last message is not from the user', () => {
        const result = validateChatRequest([{ role: 'assistant', content: 'hi' }]);
        expect(result).toEqual({
            ok: false,
            status: 400,
            error: 'The last message must be a non-empty user message',
        });
    });

    it('rejects when the last user message is blank', () => {
        const result = validateChatRequest([{ role: 'user', content: '   ' }]);
        expect(result).toEqual({
            ok: false,
            status: 400,
            error: 'The last message must be a non-empty user message',
        });
    });

    it('rejects when the last message content is not a string', () => {
        const result = validateChatRequest([{ role: 'user', content: 42 }]);
        expect(result.ok).toBe(false);
    });

    it('accepts a valid request, separating the latest message from history', () => {
        const result = validateChatRequest([
            { role: 'user', content: 'first question' },
            { role: 'assistant', content: 'first answer' },
            { role: 'user', content: 'second question' },
        ]);
        expect(result).toEqual({
            ok: true,
            message: 'second question',
            history: [
                { role: 'user', content: 'first question' },
                { role: 'assistant', content: 'first answer' },
            ],
        });
    });
});

describe('toLangChainHistory', () => {
    it('maps user turns to HumanMessage and other turns to AIMessage', () => {
        const history = toLangChainHistory([
            { role: 'user', content: 'hi' },
            { role: 'assistant', content: 'hello' },
        ]);

        expect(history[0]).toBeInstanceOf(HumanMessage);
        expect(history[0].content).toBe('hi');
        expect(history[1]).toBeInstanceOf(AIMessage);
        expect(history[1].content).toBe('hello');
    });

    it('drops turns with non-string or empty content', () => {
        const history = toLangChainHistory([
            { role: 'user', content: '' },
            { role: 'user', content: undefined as unknown as string },
            { role: 'user', content: 'kept' },
        ]);
        expect(history).toHaveLength(1);
        expect(history[0].content).toBe('kept');
    });

    it('returns an empty array for empty history', () => {
        expect(toLangChainHistory([])).toEqual([]);
    });
});
