import {
    getAllAbout,
    getAllMethods,
    getAllPosts,
    getAllProjects,
} from '@/utils/mdx';

export type KnowledgeKind = 'about' | 'project' | 'post' | 'method';

export interface KnowledgeDoc {
    slug: string;
    title: string;
    description: string;
    body: string;
    kind: KnowledgeKind;
    categories: string[];
}

export type RawDoc = {
    slug: string;
    content: string;
    metadata: { title?: string; description?: string; chat?: string; categories?: string };
};

/**
 * Frontmatter is parsed by a naive line-based parser (see utils/mdx.ts) that
 * returns every value as a string. `categories: ai-engineering, ux-research`
 * therefore arrives as one comma-separated string, not an array.
 */
function parseCategories(raw?: string): string[] {
    if (!raw) return [];
    return raw
        .split(',')
        .map((category) => category.trim())
        .filter((category) => category.length > 0);
}

/**
 * Many project files are frontmatter only. Falling back to the description
 * keeps every project reachable by the chat; a written case study simply
 * gives the model far more to work with.
 *
 * Exported so the drop/fallback decision can be unit-tested directly against
 * constructed inputs, independent of what real content files happen to contain.
 */
export function toKnowledgeDoc(raw: RawDoc, kind: KnowledgeKind): KnowledgeDoc | null {
    const title = raw.metadata.title?.trim() ?? '';
    const description = raw.metadata.description?.trim() ?? '';
    const body = raw.content.trim() || description;

    if (!body) return null;

    return {
        slug: raw.slug,
        title,
        description,
        body,
        kind,
        categories: parseCategories(raw.metadata.categories),
    };
}

/**
 * Frontmatter values are strings, so the flag is the literal string "true",
 * never a boolean. About documents carry no flag and are always eligible;
 * everything else (projects, posts, methods) must opt in explicitly so that
 * template/placeholder content (e.g. the starter portfolio-website page)
 * never reaches the model.
 */
function isChatEligible(raw: RawDoc, kind: KnowledgeKind): boolean {
    if (kind === 'about') return true;
    return raw.metadata.chat === 'true';
}

function collect(raws: RawDoc[], kind: KnowledgeKind): KnowledgeDoc[] {
    return raws
        .filter((raw) => isChatEligible(raw, kind))
        .map((raw) => toKnowledgeDoc(raw, kind))
        .filter((doc): doc is KnowledgeDoc => doc !== null);
}

export function getKnowledgeDocs(): KnowledgeDoc[] {
    return [
        ...collect(getAllAbout() as RawDoc[], 'about'),
        ...collect(getAllProjects() as unknown as RawDoc[], 'project'),
        ...collect(getAllPosts() as unknown as RawDoc[], 'post'),
        ...collect(getAllMethods() as unknown as RawDoc[], 'method'),
    ];
}

export function getAlwaysOnDocs(): KnowledgeDoc[] {
    return getKnowledgeDocs().filter((doc) => doc.kind === 'about');
}

export function getRetrievableDocs(): KnowledgeDoc[] {
    return getKnowledgeDocs().filter((doc) => doc.kind !== 'about');
}
