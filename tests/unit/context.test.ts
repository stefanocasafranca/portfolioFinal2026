import { describe, it, expect } from 'vitest';
import { formatContext } from '@/utils/chat/context';
import type { KnowledgeDoc } from '@/utils/chat/knowledge';

const DOCS: KnowledgeDoc[] = [
    { slug: 'bio', title: 'About Stefano', description: 'Who I am.', body: 'I am Stefano.', kind: 'about' },
    { slug: 'build-script', title: 'BUILD_SCRIPT.md', description: 'Google Doc as source of truth.', body: 'The Problem: tickets.', kind: 'project' },
];

describe('formatContext', () => {
    it('includes every document title and body', () => {
        const out = formatContext(DOCS);
        expect(out).toContain('About Stefano');
        expect(out).toContain('I am Stefano.');
        expect(out).toContain('BUILD_SCRIPT.md');
        expect(out).toContain('The Problem: tickets.');
    });

    it('marks project documents with their slug so links can be built', () => {
        expect(formatContext(DOCS)).toContain('build-script');
    });

    it('returns a non-empty string for an empty document list', () => {
        expect(typeof formatContext([])).toBe('string');
    });
});
