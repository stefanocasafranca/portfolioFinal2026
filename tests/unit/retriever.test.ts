import { describe, it, expect } from 'vitest';
import { tokenize, tokenizeForCategories, scoreDoc, selectDocs, MIN_SCORE, DEFAULT_K, PortfolioRetriever } from '@/utils/chat/retriever';
import type { KnowledgeDoc } from '@/utils/chat/knowledge';

const doc = (
    slug: string,
    title: string,
    description: string,
    body: string,
    categories: string[] = []
): KnowledgeDoc => ({ slug, title, description, body, kind: 'project', categories });

const FIXTURES: KnowledgeDoc[] = [
    doc('redivo-sleep-app', 'Redivo Sleep App', 'Improving sleep quality with red light therapy.', 'A mobile app for sleep habit formation.'),
    doc('build-script', 'BUILD_SCRIPT.md', 'Turns a Google Doc into the source of truth for a website.', 'The Problem: agencies answer support tickets forever.'),
    doc('cle', 'Code Learning Evolution', 'Programming education combined with physical movement.', 'Research on movement and learning retention.'),
];

// Constructed fixtures, one per disambiguation area, so these tests stay
// stable as real project content changes. Category slugs deliberately share
// a word ("design") the way the real corpus does (product-design /
// industrial-design), to prove the fix doesn't cross-match on partial overlap.
const AREA_FIXTURES: KnowledgeDoc[] = [
    doc('ai-proj', 'Retrieval Chatbot', 'A LangChain based assistant.', 'Built a lexical retrieval pipeline.', ['ai-engineering']),
    doc('ux-proj', 'Research Sprint', 'Interviews and synthesis.', 'Ran usability studies with participants.', ['ux-research']),
    doc('product-proj', 'Wellness App', 'A consumer product.', 'Designed onboarding flows for a mobile app.', ['product-design']),
    doc('industrial-proj', 'Desk Lamp', 'A physical object.', 'CNC-machined an aluminum enclosure.', ['industrial-design']),
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

describe('tokenizeForCategories', () => {
    it('keeps short real words like "ai" that the length filter would otherwise drop', () => {
        expect(tokenizeForCategories('AI Engineering')).toEqual(['ai', 'engineering']);
        // Contrast with the normal tokenizer, which is the bug this exists to fix.
        expect(tokenize('AI Engineering')).toEqual(['engineering']);
    });

    it('still removes stopwords, so pronouns cannot slip in as category tokens', () => {
        expect(tokenizeForCategories('tell me about my work')).toEqual(['work']);
    });
});

describe('category-aware scoring', () => {
    it('retrieves the AI Engineering project even though "ai" is a short token', () => {
        const slugs = selectDocs('AI Engineering', AREA_FIXTURES).map((d) => d.slug);
        expect(slugs).toContain('ai-proj');
    });

    it('excludes the AI Engineering project when a different area is named', () => {
        const slugs = selectDocs('Industrial Design', AREA_FIXTURES).map((d) => d.slug);
        expect(slugs).not.toContain('ai-proj');
    });

    it('retrieves the UX Research project for that area', () => {
        const slugs = selectDocs('UX Research', AREA_FIXTURES).map((d) => d.slug);
        expect(slugs).toContain('ux-proj');
    });

    it('excludes the UX Research project when a different area is named', () => {
        const slugs = selectDocs('Product and Design', AREA_FIXTURES).map((d) => d.slug);
        expect(slugs).not.toContain('ux-proj');
    });

    it('retrieves the Product and Design project for that area', () => {
        const slugs = selectDocs('Product and Design', AREA_FIXTURES).map((d) => d.slug);
        expect(slugs).toContain('product-proj');
    });

    it('does not retrieve the Industrial Design project for "Product and Design", despite sharing the word "design"', () => {
        const slugs = selectDocs('Product and Design', AREA_FIXTURES).map((d) => d.slug);
        expect(slugs).not.toContain('industrial-proj');
    });

    it('retrieves the Industrial Design project for that area', () => {
        const slugs = selectDocs('Industrial Design', AREA_FIXTURES).map((d) => d.slug);
        expect(slugs).toContain('industrial-proj');
    });

    it('does not retrieve the Product and Design project for "Industrial Design", despite sharing the word "design"', () => {
        const slugs = selectDocs('Industrial Design', AREA_FIXTURES).map((d) => d.slug);
        expect(slugs).not.toContain('product-proj');
    });

    it('scores a full category match at least as high as a title match', () => {
        const titleOnlyScore = scoreDoc(['redivo'], doc('x', 'Redivo X', '', ''));
        const categoryOnlyScore = scoreDoc(
            [],
            doc('y', 'Unrelated Title', '', '', ['ai-engineering']),
            ['ai', 'engineering']
        );
        expect(categoryOnlyScore).toBeGreaterThanOrEqual(titleOnlyScore);
    });
});

describe('selectDocs fallback vs. k', () => {
    // More fixtures than DEFAULT_K, so "returned everything" and "returned k"
    // are distinguishable outcomes rather than a coincidence.
    // Description matches (score 2) rather than body matches (score 1), so
    // every fixture clears MIN_SCORE and the k-cap is what's under test.
    const MANY_FIXTURES: KnowledgeDoc[] = [
        doc('one', 'One', 'alpha', ''),
        doc('two', 'Two', 'bravo', ''),
        doc('three', 'Three', 'charlie', ''),
        doc('four', 'Four', 'delta', ''),
        doc('five', 'Five', 'echo', ''),
    ];

    it('falls back to the FULL corpus, not just k, when nothing clears the threshold', () => {
        expect(MANY_FIXTURES.length).toBeGreaterThan(DEFAULT_K);
        const result = selectDocs('kubernetes operator tuning', MANY_FIXTURES, DEFAULT_K);
        expect(result).toHaveLength(MANY_FIXTURES.length);
    });

    it('still caps at k when there IS a match, proving the two code paths are distinct', () => {
        const result = selectDocs('alpha bravo charlie delta echo', MANY_FIXTURES, DEFAULT_K);
        expect(result.length).toBeLessThanOrEqual(DEFAULT_K);
        expect(result.length).toBeLessThan(MANY_FIXTURES.length);
    });
});

describe('MIN_SCORE pinning', () => {
    // A description-token hit (score 2) and a body-token hit (score 1) on
    // either side of the current MIN_SCORE=2 threshold. If MIN_SCORE were
    // lowered to 1, the body-hit test below would start returning a single
    // document instead of falling back. If it were raised to 3, the
    // description-hit test would start falling back instead of returning one.
    const descriptionHitDoc = doc('desc-hit', 'Desc Hit', 'Mentions widgetdescription here.', 'unrelated body text');
    const bodyHitDoc = doc('body-hit', 'Body Hit', 'unrelated description', 'Mentions widgetbody here.');
    const filler = doc('filler', 'Filler', 'nothing relevant', 'nothing relevant either');
    const PIN_FIXTURES = [descriptionHitDoc, bodyHitDoc, filler];

    it('MIN_SCORE is 2', () => {
        expect(MIN_SCORE).toBe(2);
    });

    it('a description-token hit (score 2) clears the threshold on its own', () => {
        const result = selectDocs('widgetdescription', PIN_FIXTURES);
        expect(result).toEqual([descriptionHitDoc]);
    });

    it('a body-token hit alone (score 1) does not clear the threshold and falls back', () => {
        const result = selectDocs('widgetbody', PIN_FIXTURES);
        expect(result).toHaveLength(PIN_FIXTURES.length);
    });
});

describe('PortfolioRetriever._getRelevantDocuments', () => {
    it('exposes the metadata.slug (and title/description/kind) contract route.ts depends on', async () => {
        const retriever = new PortfolioRetriever({ docs: FIXTURES, k: 3 });
        const results = await retriever._getRelevantDocuments('Tell me about the Redivo sleep app');

        expect(results.length).toBeGreaterThan(0);
        expect(results[0].metadata.slug).toBe('redivo-sleep-app');
        expect(results[0].metadata.title).toBe(FIXTURES[0].title);
        expect(results[0].metadata.description).toBe(FIXTURES[0].description);
        expect(results[0].metadata.kind).toBe('project');
        expect(results[0].pageContent).toBe(FIXTURES[0].body);
    });
});
