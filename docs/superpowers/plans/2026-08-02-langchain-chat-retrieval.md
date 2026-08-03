# AI Portfolio Chat Retrieval Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the chat's hardcoded 119-line knowledge prompt with a document-level LangChain retrieval layer sourced from versioned content files.

**Architecture:** Content lives as MDX under `content/`. A loader (`utils/chat/knowledge.ts`) adapts the existing `utils/mdx.ts` parser into typed `KnowledgeDoc` objects. A retriever (`utils/chat/retriever.ts`) scores documents by deterministic lexical overlap and returns the top matches. The chat route injects `about` documents always, retrieved project documents per question, and keeps only persona and response rules in the system prompt.

**Tech Stack:** Next.js 15.5.9 (App Router, Turbopack), LangChain (`@langchain/core`, `@langchain/openai`), Vercel AI SDK 3.4.0, TypeScript 5.8, Vitest.

## Global Constraints

- Path alias is `@/*` → `./*` (from `tsconfig.json`). Use `@/utils/...` in imports.
- Reuse `utils/mdx.ts` for frontmatter parsing. Do **not** write a second parser.
- Retrieved content is passed as a **ChatPromptTemplate variable**, never string-concatenated into the template. Content contains `{` and `}` characters (frontmatter image JSON), which would break template parsing.
- Retrieval is deterministic and model-free. No embedding calls, no LLM router.
- Never drop a project from reachability: when an MDX body is empty, fall back to its frontmatter `description`.
- Existing route validation behaviour must not regress: non-array/empty `messages`, trailing non-user message, and blank content each return HTTP 400.
- Model stays `gpt-4o-mini`, `temperature: 0.7`, `streaming: true`.
- Dev server runs on port **3000**.
- **Dependency changes use npm**, not yarn. `package-lock.json` is the tracked lockfile; there is
  no `yarn.lock`, despite the `packageManager` field in `package.json` naming yarn. Running
  `yarn add` here resolves the whole tree from scratch and hangs. Test commands run as
  `npm test`.

---

### Task 1: Vitest setup and `content/about` knowledge files

**Files:**
- Create: `vitest.config.ts`
- Create: `content/about/bio.mdx`
- Create: `content/about/current-work.mdx`
- Create: `content/about/looking-for.mdx`
- Modify: `package.json` (add `vitest` devDependency, `test` scripts)
- Modify: `utils/mdx.ts` (add `getAllAbout`)
- Test: `tests/unit/mdx.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `getAllAbout(): MDXData<BaseMetadata>[]` from `@/utils/mdx`, reading `content/about`. Content files with `title` and `description` frontmatter.

- [ ] **Step 1: Install Vitest**

The repo is npm-managed: `package-lock.json` is the tracked lockfile and no
`yarn.lock` exists. Use npm, not yarn, for dependency changes.

```bash
npm install -D vitest@^3.2.4
```

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
    test: {
        environment: 'node',
        include: ['tests/unit/**/*.test.ts'],
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './'),
        },
    },
});
```

- [ ] **Step 3: Add test scripts to `package.json`**

In the `"scripts"` block, add:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Write the failing test**

Create `tests/unit/mdx.test.ts`:

```ts
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
```

- [ ] **Step 5: Run test to verify it fails**

Run: `yarn test`
Expected: FAIL — `getAllAbout` is not exported from `@/utils/mdx`.

- [ ] **Step 6: Add `getAllAbout` to `utils/mdx.ts`**

Append to `utils/mdx.ts`:

```ts
export const getAllAbout = (): MDXData<BaseMetadata>[] =>
    getMDXData<BaseMetadata>(path.join(process.cwd(), 'content/about'));
```

- [ ] **Step 7: Create `content/about/bio.mdx`**

```mdx
---
title: About Stefano
description: Who I am, where I come from, and my educational background.
---

I'm Stefano Casafranca Laos. I work as a UX Researcher, Product Designer, and Strategic Planner for UX and AI at the Center for Government and Civic Service in Austin, Texas.

I'm originally from Lima, Peru, and I'm bilingual in English and Spanish.

My educational background combines design and engineering. I'm completing an A.A.S. in Application Development at Austin Community College, graduating May 14, 2026. Before that I earned a B.A. in Industrial Design from Pontificia Universidad Catolica del Peru, studying from 2018 to 2023.

That combination shapes how I work: UX research, product design, and systems thinking together rather than as separate disciplines.
```

- [ ] **Step 8: Create `content/about/current-work.mdx`**

```mdx
---
title: Current Work and Experience
description: My role at the Center for Government and Civic Service, and recent positions.
---

I'm a Strategy Planner for UX and AI Technologies at the Center for Government and Civic Service in Austin, a role I've held since April 2025.

I'm piloting the Public Service Software Factory, which embeds AI-assisted development into an internship scrum model for non-technical teams. It launched with a 16-student cohort building public-service AI solutions using tools like Claude Code, LangChain, and common web stacks.

I'm also leading the end-to-end rollout of a new website built with Astro and TailwindCSS, featuring an automated intake-to-reservation workflow projected to reduce manual form-review hours and accelerate approvals by around 80 percent.

I've driven cross-functional initiatives including a 170-participant hackathon in partnership with NASA Space Apps, which secured more than 25,000 dollars in sponsorships.

Earlier roles include Coordinator of the Food Access Program at ACC Social Support Resource Development from March to June 2025, where I ran guerrilla UX research on navigation and access barriers in food-access wayfinding and supported service delivery for more than 250 households. Before that I was a UX Designer and Business Development Specialist at the ACC Bioscience Incubator from July 2024 to February 2025. I've also worked as a UX and Product Designer at Redivo.app since December 2025.
```

- [ ] **Step 9: Create `content/about/looking-for.mdx`**

```mdx
---
title: What I'm Looking For
description: The roles I'm seeking and how to reach me.
---

I'm passionate about civic tech, education, and human-centered systems. I see myself as a humble enabler. I help teams uncover real needs and translate insights into clear, actionable direction.

I'm open to UX Researcher and UX or Product Designer roles, especially in civic tech, education, and AI-supported systems with real social impact.

You can reach me at scasafrancal01@gmail.com. I'm based in Austin, Texas.
```

- [ ] **Step 10: Run test to verify it passes**

Run: `yarn test`
Expected: PASS, both tests green.

- [ ] **Step 11: Commit**

```bash
git add vitest.config.ts package.json yarn.lock utils/mdx.ts content/about tests/unit/mdx.test.ts
git commit -m "feat(chat): add about content files and Vitest setup"
```

---

### Task 2: Knowledge loader

**Files:**
- Create: `utils/chat/knowledge.ts`
- Test: `tests/unit/knowledge.test.ts`

**Interfaces:**
- Consumes: `getAllAbout`, `getAllProjects`, `getAllPosts`, `getAllMethods` from `@/utils/mdx`.
- Produces:
  - `type KnowledgeKind = 'about' | 'project' | 'post' | 'method'`
  - `interface KnowledgeDoc { slug: string; title: string; description: string; body: string; kind: KnowledgeKind }`
  - `getKnowledgeDocs(): KnowledgeDoc[]` — all documents
  - `getAlwaysOnDocs(): KnowledgeDoc[]` — documents with `kind === 'about'`
  - `getRetrievableDocs(): KnowledgeDoc[]` — documents with `kind !== 'about'`

- [ ] **Step 1: Write the failing test**

Create `tests/unit/knowledge.test.ts`:

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `yarn test`
Expected: FAIL — cannot resolve `@/utils/chat/knowledge`.

- [ ] **Step 3: Implement `utils/chat/knowledge.ts`**

```ts
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

type RawDoc = {
    slug: string;
    content: string;
    metadata: { title?: string; description?: string };
};

/**
 * Many project files are frontmatter only. Falling back to the description
 * keeps every project reachable by the chat; a written case study simply
 * gives the model far more to work with.
 */
function toKnowledgeDoc(raw: RawDoc, kind: KnowledgeKind): KnowledgeDoc | null {
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `yarn test`
Expected: PASS, all six tests green.

- [ ] **Step 5: Commit**

```bash
git add utils/chat/knowledge.ts tests/unit/knowledge.test.ts
git commit -m "feat(chat): add knowledge loader over content directory"
```

---

### Task 3: Lexical retriever

**Files:**
- Create: `utils/chat/retriever.ts`
- Test: `tests/unit/retriever.test.ts`

**Interfaces:**
- Consumes: `KnowledgeDoc` from `@/utils/chat/knowledge`.
- Produces:
  - `tokenize(input: string): string[]`
  - `scoreDoc(queryTokens: string[], doc: KnowledgeDoc): number`
  - `selectDocs(question: string, docs: KnowledgeDoc[], k?: number): KnowledgeDoc[]`
  - `MIN_SCORE: number`
  - `class PortfolioRetriever extends BaseRetriever` with `_getRelevantDocuments(query: string): Promise<Document[]>`

- [ ] **Step 1: Write the failing test**

Create `tests/unit/retriever.test.ts`:

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `yarn test`
Expected: FAIL — cannot resolve `@/utils/chat/retriever`.

- [ ] **Step 3: Implement `utils/chat/retriever.ts`**

```ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `yarn test`
Expected: PASS, all retriever tests green.

- [ ] **Step 5: Commit**

```bash
git add utils/chat/retriever.ts tests/unit/retriever.test.ts
git commit -m "feat(chat): add deterministic lexical retriever"
```

---

### Task 4: Wire retrieval into the chat route

**Files:**
- Modify: `app/api/chat/route.ts`
- Create: `utils/chat/context.ts`
- Test: `tests/unit/context.test.ts`

**Interfaces:**
- Consumes: `getAlwaysOnDocs` from `@/utils/chat/knowledge`, `PortfolioRetriever` from `@/utils/chat/retriever`.
- Produces: `formatContext(docs: KnowledgeDoc[]): string` from `@/utils/chat/context`.

- [ ] **Step 1: Write the failing test**

Create `tests/unit/context.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { formatContext } from '@/utils/chat/context';
import type { KnowledgeDoc } from '@/utils/chat/knowledge';

const DOCS: KnowledgeDoc[] = [
    { slug: 'bio', title: 'About Stefano', description: 'Who I am.', body: 'I am Stefano.', kind: 'about' },
    { slug: 'build-script', title: 'BUILD_SCRIPT.md', description: 'Google Doc as source of truth.', body: 'The Problem: tickets.', kind: 'project' },
];

describe('formatContext', () => {
    it('includes every document title and body', () => {
        const out = formatContext(DOCS);
        expect(out).toContain('About Stefano');
        expect(out).toContain('I am Stefano.');
        expect(out).toContain('BUILD_SCRIPT.md');
        expect(out).toContain('The Problem: tickets.');
    });

    it('marks project documents with their slug so links can be built', () => {
        expect(formatContext(DOCS)).toContain('build-script');
    });

    it('returns a non-empty string for an empty document list', () => {
        expect(typeof formatContext([])).toBe('string');
    });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `yarn test`
Expected: FAIL — cannot resolve `@/utils/chat/context`.

- [ ] **Step 3: Implement `utils/chat/context.ts`**

```ts
import type { KnowledgeDoc } from '@/utils/chat/knowledge';

/**
 * Renders documents into the {context} template variable. This string is
 * passed to the prompt as a variable, never concatenated into the template
 * itself, because document text can contain braces.
 */
export function formatContext(docs: KnowledgeDoc[]): string {
    if (docs.length === 0) return 'No additional context available.';

    return docs
        .map((doc) => {
            const header =
                doc.kind === 'project'
                    ? `### ${doc.title} (slug: ${doc.slug})`
                    : `### ${doc.title}`;
            return `${header}\n${doc.description}\n\n${doc.body}`;
        })
        .join('\n\n---\n\n');
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `yarn test`
Expected: PASS.

- [ ] **Step 5: Replace the system message in `app/api/chat/route.ts`**

Delete the entire `SYSTEM_MESSAGE` constant (currently lines 8-119) and replace it with:

```ts
const SYSTEM_MESSAGE = `You are Stefano Casafranca Laos, answering questions about yourself on your portfolio website. Respond in first person, as if you are casually explaining your work to someone over coffee. Be humble, precise, and authentic. Do not exaggerate, invent experience, or change role titles.

RESPONSE STYLE
- For project-related questions: give detailed responses (5-8 sentences)
- For general questions: keep it conversational (3-5 sentences)
- Always use first person ("I'm", "I worked", "I learned")
- Be warm, thoughtful, and professional
- Use emojis sparingly and naturally (never more than one per response)
- Focus on insights, decisions, challenges, and outcomes
- Avoid listing tools or frameworks unless directly relevant to a UX or research decision

GROUNDING RULES
- Answer ONLY from the CONTEXT below. It is the authoritative source about me.
- If the context does not cover something, say you would rather not speak to it than guess.
- Never invent metrics, dates, employers, or outcomes.
- Never describe yourself as a founder or entrepreneur in UX Research contexts.

PROJECT ANSWERS
- Discuss the projects present in the context, and only those.
- Give each project its own paragraph with a bold title, covering the problem, the key insight, the approach, and the outcome.
- End each project paragraph with a link built from its slug: [View Project](/projects/SLUG)
- Separate project paragraphs with a blank line.

CONTEXT
{context}`;
```

- [ ] **Step 6: Add retrieval to the POST handler**

In `app/api/chat/route.ts`, add these three imports at the top:

```ts
import { PortfolioRetriever } from '@/utils/chat/retriever';
import { getAlwaysOnDocs, getRetrievableDocs } from '@/utils/chat/knowledge';
import { formatContext } from '@/utils/chat/context';
```

After the `const message = latest.content;` line, add:

```ts
    // Always-on identity context plus documents retrieved for this question.
    const retriever = new PortfolioRetriever();
    const retrieved = await retriever.invoke(message);
    const retrievedSlugs = new Set(retrieved.map((doc) => doc.metadata.slug as string));
    const retrievedDocs = getRetrievableDocs().filter((doc) => retrievedSlugs.has(doc.slug));
    const context = formatContext([...getAlwaysOnDocs(), ...retrievedDocs]);
```

- [ ] **Step 7: Pass `context` into the chain**

Change the `chain.stream` call from:

```ts
    const stream = await chain.stream({
      input: message,
      history: history,
    });
```

to:

```ts
    const stream = await chain.stream({
      input: message,
      history: history,
      context: context,
    });
```

- [ ] **Step 8: Verify the full suite and typecheck**

Run: `yarn test && npx tsc --noEmit`
Expected: all tests PASS, typecheck clean.

- [ ] **Step 9: Verify against the running dev server**

Start the server if needed: `yarn dev`

```bash
curl -s -X POST http://localhost:3000/api/chat -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"user","content":"Tell me about BUILD_SCRIPT"}],"sessionId":"plan-t4"}' \
  -w "\n[HTTP %{http_code}]\n" | tail -20
```

Expected: HTTP 200, streamed response mentioning the Google Doc source-of-truth idea and the 12-participant study. This proves retrieval reached the model, since that content exists nowhere in the system prompt.

Then confirm the validation guards still hold:

```bash
curl -s -X POST http://localhost:3000/api/chat -H 'Content-Type: application/json' -d '{"messages":[]}' -w " [%{http_code}]\n"
```

Expected: `[400]`.

- [ ] **Step 10: Commit**

```bash
git add app/api/chat/route.ts utils/chat/context.ts tests/unit/context.test.ts
git commit -m "feat(chat): retrieve content instead of hardcoding knowledge"
```

---

### Task 5: Deployment file tracing

**Files:**
- Modify: `next.config.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: nothing consumed by later tasks.

**Why:** The chat route is dynamic and reads `content/` from disk at request time via `utils/mdx.ts`. Next.js traces imported modules, but not files read through `fs` at runtime. Without an explicit tracing rule the content directory is absent from the deployed function bundle and every answer silently falls back to whatever loads, or the route throws `ENOENT`. Project pages are unaffected because they are generated at build time.

- [ ] **Step 1: Add tracing config to `next.config.ts`**

Add this key to the `nextConfig` object, alongside `transpilePackages`:

```ts
    outputFileTracingIncludes: {
        '/api/chat': ['./content/**/*'],
    },
```

- [ ] **Step 2: Verify the production build succeeds**

Run: `yarn build`
Expected: build completes with no errors.

- [ ] **Step 3: Verify the production server answers from content**

```bash
yarn start &
sleep 5
curl -s -X POST http://localhost:3000/api/chat -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"user","content":"Tell me about BUILD_SCRIPT"}],"sessionId":"plan-t5"}' \
  -w "\n[HTTP %{http_code}]\n" | tail -15
```

Expected: HTTP 200, response references the Google Doc workflow. Stop the server afterwards.

- [ ] **Step 4: Commit**

```bash
git add next.config.ts
git commit -m "fix(chat): include content directory in serverless trace"
```

---

## Out of scope for this plan

**Writing the seven missing case studies.** `redivo-sleep-app`, `cle`, `ux-research`, `fogo-direto`, `workshop-design`, `acc-bioscience-incubator-website-redesign`, and `design-process` have zero body content. This plan makes them reachable via their frontmatter descriptions, but the answers stay thin until real case studies exist.

That work is collaborative — drafting from vault material, then fact-checking each claim — and belongs in its own session. Start with REDIVO, using `content/projects/build-script.mdx` as the format model (Problem, Insight, Solution, Validation, Status). Source material lives in `~/code/s-vault`, notably `06_raw/The Wall - REDIVO App Blocking Plan.md` and the Human-Computer Interaction research notes.

**Playwright end-to-end tests.** `@playwright/test` is not installed and `playwright.config.ts` targets port 3002 while the dev server runs on 3000. Fixing that is worth doing but is independent of retrieval.
