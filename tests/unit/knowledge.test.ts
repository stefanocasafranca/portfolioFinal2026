import { describe, it, expect } from 'vitest';
import {
    getKnowledgeDocs,
    getAlwaysOnDocs,
    getRetrievableDocs,
} from '@/utils/chat/knowledge';

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

describe('document partitioning', () => {
    it('always-on documents are the about documents', () => {
        expect(getAlwaysOnDocs().every((d) => d.kind === 'about')).toBe(true);
        expect(getAlwaysOnDocs().length).toBeGreaterThanOrEqual(3);
    });

    it('retrievable documents exclude about documents', () => {
        expect(getRetrievableDocs().every((d) => d.kind !== 'about')).toBe(true);
    });
});
