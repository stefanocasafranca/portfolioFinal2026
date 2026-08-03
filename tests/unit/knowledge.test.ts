import { describe, it, expect } from 'vitest';
import {
    getKnowledgeDocs,
    getAlwaysOnDocs,
    getRetrievableDocs,
    toKnowledgeDoc,
    type RawDoc,
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
