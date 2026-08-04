import { describe, it, expect } from 'vitest';
import {
    getKnowledgeDocs,
    getAlwaysOnDocs,
    getRetrievableDocs,
    toKnowledgeDoc,
    isChatEligible,
    collect,
    type RawDoc,
    type KnowledgeKind,
} from '@/utils/chat/knowledge';

function makeRaw(
    content: string,
    description: string,
    extra: { chat?: string; categories?: string } = {}
): RawDoc {
    return {
        slug: 'fixture-slug',
        content,
        metadata: { title: 'Fixture Title', description, ...extra },
    };
}

describe('getKnowledgeDocs', () => {
    it('loads documents from every content directory', () => {
        const kinds = new Set(getKnowledgeDocs().map((d) => d.kind));
        expect(kinds.has('about')).toBe(true);
        expect(kinds.has('project')).toBe(true);
    });

    it('falls back to description when the body is empty', () => {
        const redivo = getKnowledgeDocs().find((d) => d.slug === 'redivo-sleep-app');
        expect(redivo).toBeDefined();
        expect(redivo!.body.length).toBeGreaterThan(0);
        expect(redivo!.body).toContain('sleep');
    });

    it('keeps the full body when one exists', () => {
        const buildScript = getKnowledgeDocs().find((d) => d.slug === 'build-script');
        expect(buildScript!.body).toContain('The Problem');
    });

    it('never returns a document with an empty body', () => {
        expect(getKnowledgeDocs().every((d) => d.body.trim().length > 0)).toBe(true);
    });
});

describe('toKnowledgeDoc', () => {
    it('keeps the body when both body and description are non-empty', () => {
        const doc = toKnowledgeDoc(makeRaw('Real body text', 'A description'), 'project');
        expect(doc).not.toBeNull();
        expect(doc!.body).toBe('Real body text');
    });

    it('falls back to the description when the body is empty', () => {
        const doc = toKnowledgeDoc(makeRaw('', 'A description'), 'project');
        expect(doc).not.toBeNull();
        expect(doc!.body).toBe('A description');
    });

    it('keeps the body when the description is empty', () => {
        const doc = toKnowledgeDoc(makeRaw('Real body text', ''), 'project');
        expect(doc).not.toBeNull();
        expect(doc!.body).toBe('Real body text');
    });

    it('drops the document when both body and description are empty', () => {
        const doc = toKnowledgeDoc(makeRaw('', ''), 'project');
        expect(doc).toBeNull();
    });
});

describe('document partitioning', () => {
    it('always-on documents are the about documents', () => {
        expect(getAlwaysOnDocs().every((d) => d.kind === 'about')).toBe(true);
        expect(getAlwaysOnDocs().length).toBeGreaterThanOrEqual(3);
    });

    it('retrievable documents exclude about documents', () => {
        expect(getRetrievableDocs().every((d) => d.kind !== 'about')).toBe(true);
    });
});

describe('chat flag filtering', () => {
    it('includes a flagged project (build-script has chat: true)', () => {
        const slugs = getKnowledgeDocs().map((d) => d.slug);
        expect(slugs).toContain('build-script');
    });

    it('excludes an unflagged project (portfolio-website and next-blog-starter have no chat flag)', () => {
        const slugs = getKnowledgeDocs().map((d) => d.slug);
        expect(slugs).not.toContain('portfolio-website');
        expect(slugs).not.toContain('next-blog-starter');
    });

    it('always includes about documents even though they carry no chat flag', () => {
        expect(getAlwaysOnDocs().length).toBeGreaterThan(0);
        expect(getAlwaysOnDocs().every((d) => d.kind === 'about')).toBe(true);
    });
});

describe('categories', () => {
    it('parses a comma-separated categories string into an array', () => {
        const buildScript = getKnowledgeDocs().find((d) => d.slug === 'build-script');
        expect(buildScript).toBeDefined();
        expect(buildScript!.categories).toEqual(['ai-engineering', 'ux-research']);
    });

    it('yields an empty array when categories are missing', () => {
        const doc = toKnowledgeDoc(makeRaw('Real body text', 'A description'), 'project');
        expect(doc).not.toBeNull();
        expect(doc!.categories).toEqual([]);
    });
});

// This filter is what keeps placeholder/unreviewed content away from
// prospective employers, so it is tested directly against constructed
// fixtures rather than only indirectly via real content slugs.
describe('isChatEligible', () => {
    it('drops a project with no chat key', () => {
        expect(isChatEligible(makeRaw('body', 'desc'), 'project')).toBe(false);
    });

    it('drops a project with chat: "false"', () => {
        expect(isChatEligible(makeRaw('body', 'desc', { chat: 'false' }), 'project')).toBe(false);
    });

    it('keeps a project with chat: "true"', () => {
        expect(isChatEligible(makeRaw('body', 'desc', { chat: 'true' }), 'project')).toBe(true);
    });

    it('keeps an about-kind doc with no chat key at all', () => {
        expect(isChatEligible(makeRaw('body', 'desc'), 'about')).toBe(true);
    });

    it('applies the same rule to posts as to projects', () => {
        expect(isChatEligible(makeRaw('body', 'desc'), 'post')).toBe(false);
        expect(isChatEligible(makeRaw('body', 'desc', { chat: 'false' }), 'post')).toBe(false);
        expect(isChatEligible(makeRaw('body', 'desc', { chat: 'true' }), 'post')).toBe(true);
    });

    it('applies the same rule to methods as to projects', () => {
        expect(isChatEligible(makeRaw('body', 'desc'), 'method')).toBe(false);
        expect(isChatEligible(makeRaw('body', 'desc', { chat: 'false' }), 'method')).toBe(false);
        expect(isChatEligible(makeRaw('body', 'desc', { chat: 'true' }), 'method')).toBe(true);
    });
});

describe('collect', () => {
    const rawFor = (slug: string, kind: KnowledgeKind, chat?: string): RawDoc => ({
        slug,
        content: `${slug} body`,
        metadata: { title: slug, description: `${slug} description`, chat },
    });

    it('drops ineligible docs and keeps eligible ones, per kind', () => {
        const kinds: KnowledgeKind[] = ['project', 'post', 'method'];
        for (const kind of kinds) {
            const raws = [rawFor('no-flag', kind), rawFor('flagged-false', kind, 'false'), rawFor('flagged-true', kind, 'true')];
            const slugs = collect(raws, kind).map((d) => d.slug);
            expect(slugs).toEqual(['flagged-true']);
        }
    });

    it('keeps every about doc regardless of the chat flag', () => {
        const raws = [rawFor('bio', 'about'), rawFor('other-about', 'about', 'false')];
        const slugs = collect(raws, 'about').map((d) => d.slug);
        expect(slugs).toEqual(['bio', 'other-about']);
    });
});
