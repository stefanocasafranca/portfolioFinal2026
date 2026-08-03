import { BaseRetriever, type BaseRetrieverInput } from '@langchain/core/retrievers';
import { Document } from '@langchain/core/documents';
import { getRetrievableDocs, type KnowledgeDoc } from '@/utils/chat/knowledge';

const STOPWORDS = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'of', 'to', 'in', 'on', 'for', 'with',
    'is', 'are', 'was', 'were', 'be', 'been', 'do', 'does', 'did', 'you', 'your',
    'yours', 'me', 'my', 'mine', 'i', 'it', 'its', 'this', 'that', 'these',
    'those', 'what', 'which', 'who', 'whom', 'how', 'when', 'where', 'why',
    'tell', 'about', 'can', 'could', 'would', 'should', 'please', 'give', 'show',
    'more', 'some', 'any', 'have', 'has', 'had', 'from', 'at', 'by', 'as',
]);

export const MIN_SCORE = 2;
export const DEFAULT_K = 3;

// Score contributed by a full category-slug match. Set equal to a title-token
// hit (3) so that naming an area ("AI Engineering") is at least as strong a
// signal as the words happening to appear in a project's title.
const CATEGORY_MATCH_SCORE = 3;

function normalize(input: string): string[] {
    return input
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, ' ')
        .split(/\s+/)
        .filter((token) => token.length > 0);
}

export function tokenize(input: string): string[] {
    return normalize(input).filter((token) => token.length > 2 && !STOPWORDS.has(token));
}

/**
 * Same normalization as tokenize(), but WITHOUT the minimum-length filter.
 * The length filter exists to keep short noise words out of title/description/
 * body matching, but it also discards real, short category vocabulary like
 * "ai" (from the "ai-engineering" slug). Category matching therefore uses this
 * lenient pass instead of lowering the global minimum length, which would let
 * noise words back in everywhere else. Stopwords ("me", "my", ...) are still
 * removed so they can never masquerade as category tokens.
 */
export function tokenizeForCategories(input: string): string[] {
    return normalize(input).filter((token) => !STOPWORDS.has(token));
}

/**
 * A doc matches a category only when EVERY token of that category's slug is
 * present in the query (e.g. both "ai" and "engineering" for "ai-engineering").
 * Requiring the full slug, rather than any single overlapping token, matters
 * because category slugs share words ("product-design" and "industrial-design"
 * both contain "design") — a single-token match would let a query for one area
 * pull in a project that only belongs to the other.
 */
function categoryMatchScore(categoryQueryTokens: string[], doc: KnowledgeDoc): number {
    if (categoryQueryTokens.length === 0 || doc.categories.length === 0) return 0;

    const queryTokenSet = new Set(categoryQueryTokens);
    let score = 0;
    for (const category of doc.categories) {
        const slugTokens = category.toLowerCase().split('-').filter((token) => token.length > 0);
        if (slugTokens.length > 0 && slugTokens.every((token) => queryTokenSet.has(token))) {
            score += CATEGORY_MATCH_SCORE;
        }
    }
    return score;
}

export function scoreDoc(
    queryTokens: string[],
    doc: KnowledgeDoc,
    categoryQueryTokens: string[] = queryTokens
): number {
    if (queryTokens.length === 0 && categoryQueryTokens.length === 0) return 0;

    const titleTokens = new Set([
        ...tokenize(doc.title),
        ...tokenize(doc.slug.replace(/-/g, ' ')),
    ]);
    const descriptionTokens = new Set(tokenize(doc.description));
    const bodyTokens = new Set(tokenize(doc.body));

    let score = 0;
    for (const token of queryTokens) {
        if (titleTokens.has(token)) score += 3;
        else if (descriptionTokens.has(token)) score += 2;
        else if (bodyTokens.has(token)) score += 1;
    }

    score += categoryMatchScore(categoryQueryTokens, doc);

    return score;
}

/**
 * Returns the best-matching documents, or every document when nothing clears
 * the threshold. The corpus is small enough that the fallback is always
 * affordable, so a poor match degrades to full context rather than a bad answer.
 */
export function selectDocs(
    question: string,
    docs: KnowledgeDoc[],
    k: number = DEFAULT_K
): KnowledgeDoc[] {
    const queryTokens = tokenize(question);
    const categoryQueryTokens = tokenizeForCategories(question);

    const ranked = docs
        .map((doc) => ({ doc, score: scoreDoc(queryTokens, doc, categoryQueryTokens) }))
        .filter((entry) => entry.score >= MIN_SCORE)
        .sort((a, b) => b.score - a.score);

    if (ranked.length === 0) return docs;

    return ranked.slice(0, k).map((entry) => entry.doc);
}

export interface PortfolioRetrieverInput extends BaseRetrieverInput {
    k?: number;
    docs?: KnowledgeDoc[];
}

export class PortfolioRetriever extends BaseRetriever {
    lc_namespace = ['portfolio', 'retrievers'];

    private k: number;
    private docs: KnowledgeDoc[];

    constructor(fields: PortfolioRetrieverInput = {}) {
        super(fields);
        this.k = fields.k ?? DEFAULT_K;
        this.docs = fields.docs ?? getRetrievableDocs();
    }

    async _getRelevantDocuments(query: string): Promise<Document[]> {
        return selectDocs(query, this.docs, this.k).map(
            (doc) =>
                new Document({
                    pageContent: doc.body,
                    metadata: {
                        slug: doc.slug,
                        title: doc.title,
                        description: doc.description,
                        kind: doc.kind,
                    },
                })
        );
    }
}
