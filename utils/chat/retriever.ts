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

export function tokenize(input: string): string[] {
    return input
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, ' ')
        .split(/\s+/)
        .filter((token) => token.length > 2 && !STOPWORDS.has(token));
}

export function scoreDoc(queryTokens: string[], doc: KnowledgeDoc): number {
    if (queryTokens.length === 0) return 0;

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

    const ranked = docs
        .map((doc) => ({ doc, score: scoreDoc(queryTokens, doc) }))
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
