import { describe, it, expect } from 'vitest';
import { tokenize, scoreDoc, selectDocs } from '@/utils/chat/retriever';
import type { KnowledgeDoc } from '@/utils/chat/knowledge';

const doc = (
    slug: string,
    title: string,
    description: string,
    body: string
): KnowledgeDoc => ({ slug, title, description, body, kind: 'project' });

const FIXTURES: KnowledgeDoc[] = [
    doc('redivo-sleep-app', 'Redivo Sleep App', 'Improving sleep quality with red light therapy.', 'A mobile app for sleep habit formation.'),
    doc('build-script', 'BUILD_SCRIPT.md', 'Turns a Google Doc into the source of truth for a website.', 'The Problem: agencies answer support tickets forever.'),
    doc('cle', 'Code Learning Evolution', 'Programming education combined with physical movement.', 'Research on movement and learning retention.'),
];

describe('tokenize', () => {
    it('lowercases, strips punctuation and drops stopwords', () => {
        expect(tokenize('Tell me about the Redivo Sleep App!')).toEqual(['redivo', 'sleep', 'app']);
    });

    it('returns an empty array for stopword-only input', () => {
        expect(tokenize('what is it about?')).toEqual([]);
    });
});

describe('scoreDoc', () => {
    it('weights title matches above body matches', () => {
        const titleHit = scoreDoc(['redivo'], FIXTURES[0]);
        const bodyHit = scoreDoc(['formation'], FIXTURES[0]);
        expect(titleHit).toBeGreaterThan(bodyHit);
    });

    it('scores zero when nothing overlaps', () => {
        expect(scoreDoc(['kubernetes'], FIXTURES[0])).toBe(0);
    });
});

describe('selectDocs', () => {
    it('returns the matching document for a targeted question', () => {
        const result = selectDocs('Tell me about the Redivo sleep app', FIXTURES);
        expect(result[0].slug).toBe('redivo-sleep-app');
    });

    it('does not return unrelated documents for a targeted question', () => {
        const slugs = selectDocs('Tell me about the Redivo sleep app', FIXTURES).map((d) => d.slug);
        expect(slugs).not.toContain('build-script');
    });

    it('falls back to every document when nothing clears the threshold', () => {
        expect(selectDocs('kubernetes operator tuning', FIXTURES)).toHaveLength(FIXTURES.length);
    });

    it('falls back to every document for an empty question', () => {
        expect(selectDocs('', FIXTURES)).toHaveLength(FIXTURES.length);
    });

    it('caps results at k', () => {
        expect(selectDocs('sleep app education website doc', FIXTURES, 2).length).toBeLessThanOrEqual(2);
    });
});
