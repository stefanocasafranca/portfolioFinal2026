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
}

export type RawDoc = {
    slug: string;
    content: string;
    metadata: { title?: string; description?: string };
};

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

    return { slug: raw.slug, title, description, body, kind };
}

function collect(raws: RawDoc[], kind: KnowledgeKind): KnowledgeDoc[] {
    return raws
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
