import { describe, it, expect } from 'vitest';
import { getAllAbout } from '@/utils/mdx';

describe('getAllAbout', () => {
    it('reads every mdx file in content/about', () => {
        const docs = getAllAbout();
        expect(docs.length).toBeGreaterThanOrEqual(3);
    });

    it('returns slug, title, description and body content', () => {
        const bio = getAllAbout().find((d) => d.slug === 'bio');
        expect(bio).toBeDefined();
        expect(bio!.metadata.title).toBeTruthy();
        expect(bio!.metadata.description).toBeTruthy();
        expect(bio!.content.length).toBeGreaterThan(50);
    });
});
