# AI Portfolio Chat: Content + Retrieval Design

**Date:** 2026-08-02
**Status:** Design approved, spec pending review
**Scope:** The "Ask me anything" card and the AI Portfolio chat experience

## Context

The portfolio has an "Ask me anything" grid card (`components/grid/widgets/theme.tsx`) that
switches the UI into a full-screen chat (`components/ai-portfolio/index.tsx`), backed by
`app/api/chat/route.ts`.

LangChain was already integrated in uncommitted work dated 2026-06-13: `ChatOpenAI`
(gpt-4o-mini) driven by a `ChatPromptTemplate` with a `MessagesPlaceholder`, streamed to the
client through `LangChainAdapter`, with a `PostgresCallbackHandler` logging interactions.

Two problems motivated this design.

### Problem 1: the chat was completely broken (fixed)

The client hook `useChatbot` uses `useChat` from `ai/react`, which posts `{ messages: [...] }`.
The route destructured `{ message, conversationHistory }`. Every send returned
`400 Message is required and must be a string`. The card had been dead since June.

Fixed on 2026-08-02: the route now reads `messages`, treats the last turn as the input, and
converts prior turns into `HumanMessage`/`AIMessage` objects for the history placeholder.
Previously history was passed as plain `{role, content}` objects, which the placeholder would
not have handled correctly even once the outer shape matched.

### Problem 2: knowledge is a hardcoded string

All of the bot's knowledge lives in a ~119-line system prompt (`route.ts:8-119`) containing
bio, role history, project descriptions, and style examples. It must be hand-edited whenever
the resume or projects change, and it cannot be diffed or reviewed as content.

## Current state of the corpus

The content directory totals roughly **1,129 words**, and the project files are mostly
frontmatter with no body at all:

| File | Words | Has body? |
|---|---|---|
| `content/projects/build-script.mdx` | 324 | yes |
| `content/projects/portfolio-website.mdx` | 275 | yes |
| `content/projects/next-blog-starter.mdx` | 131 | yes |
| `content/posts/how-its-going.mdx` | 154 | yes |
| `content/projects/acc-bioscience-...mdx` | 43 | no |
| `content/projects/redivo-sleep-app.mdx` | 38 | no |
| `content/projects/ux-research.mdx` | 36 | no |
| `content/methods/design-process.mdx` | 37 | no |
| `content/projects/workshop-design.mdx` | 33 | no |
| `content/projects/fogo-direto.mdx` | 31 | no |
| `content/projects/cle.mdx` | 27 | no |

Body content was measured directly by stripping frontmatter: **7 of the 11 files contain zero
body characters.** They are frontmatter only — title, description, images, layout — with no
prose whatsoever. Only `build-script` (1,393 chars), `portfolio-website` (1,403),
`how-its-going` (695), and `next-blog-starter` (543) have real bodies.

The system prompt (~1,400 words) is richer than every content file combined. The three
projects the bot is currently restricted to — Redivo, UX Research, CLE — are exactly the three
thinnest files, and all three are empty.

`content/projects/build-script.mdx` is the model to follow: frontmatter plus
**The Problem → The Insight → The Solution → Validation → Status**, with concrete outcomes
(12-participant within-subjects study, perceived control 4.5 vs 3.4, all p < .001, paper
submitted to ACM CUI 2026).

## Goals

- Knowledge lives in versioned content files, not a hardcoded string.
- The chat answers from real case studies rather than a script.
- The retrieval layer is a genuine, defensible piece of AI engineering.
- The bot can discuss any project that has a real written case study.

## Non-goals

- Vector embeddings or a pgvector store (see rationale below).
- Agentic tool use.
- Redesigning the chat UI.

## Approach decision

Three options were considered for how content reaches the model.

**A. Stuff everything into the prompt.** Concatenate all content, send every request.
Simplest, no infrastructure, but not a retrieval system and the prompt grows unbounded.

**B. Document-level retrieval (chosen).** A LangChain retriever selects the 2–3 whole
documents relevant to the question. No chunking — case studies at ~350 words are already the
right granularity. Real retrieval architecture behind a swappable interface.

**C. Full vector RAG.** Chunk, embed, pgvector, similarity search.

**Rationale for B over C:** even after every case study is written, the corpus lands around
3,500–4,000 words (~5k tokens). Similarity search over a body of text that fits in a single
prompt several times over is machinery without payoff. It adds an embedding call and a database
round-trip per message, `POSTGRES_URL` is not currently configured, and chunking 350-word
documents largely destroys their structure. Choosing document-level retrieval deliberately —
and being able to explain why — is a better engineering signal than reaching for pgvector
reflexively.

Cost is explicitly **not** part of this rationale. At gpt-4o-mini rates, stuffing 5k tokens
costs well under a tenth of a cent per message. The argument for B is answer quality and
architecture, not spend.

**Upgrade path:** when the corpus outgrows document-level selection, only
`utils/chat/retriever.ts` changes.

## Architecture

Three units with clear boundaries.

### 1. `content/` — source of truth

Case studies stay MDX in the `build-script.mdx` shape. Bio, resume facts, and role history move
out of the system prompt into `content/about/*.mdx`. Everything the bot knows becomes a file
that can be edited, diffed, and reviewed.

### 2. `utils/chat/knowledge.ts` — loader

Reads and parses the content directory, returning typed documents:

```ts
type KnowledgeDoc = {
  slug: string;
  title: string;
  description: string;
  body: string;
  kind: 'project' | 'about' | 'post' | 'method';
};
```

Knows nothing about LangChain or retrieval. Files in, documents out. It is a thin adapter over
the existing `utils/mdx.ts` parser, not a second parser — `utils/mdx.ts` already reads
`content/`, parses frontmatter, and returns `{ metadata, slug, content }`.

Documents are partitioned by kind: `about` documents are always included in context, while
projects, posts, and methods go through retrieval.

### 3. `utils/chat/retriever.ts` — selection

A LangChain `BaseRetriever` returning the documents relevant to a question.

**Selection mechanism:** deterministic lexical scoring, no model call. Each document is scored
by term overlap between the normalised question and the document's `title`, `description`, and
`body`, with title and description weighted more heavily than body. The top `k = 3` documents
scoring above a minimum threshold are returned.

This is deliberate. An LLM-based router would add a full round-trip of latency and cost to every
message to choose among fewer than a dozen documents, and it would be non-deterministic and
therefore hard to test. Lexical scoring is instant, free, and unit-testable with exact
assertions.

If no document clears the threshold, the retriever returns all documents (see Error handling).

This is the only file that changes if embeddings are introduced later.

## Data flow

```
question
  → retriever selects relevant docs
  → docs render into a {context} variable
  → ChatPromptTemplate: persona + context + history + input
  → ChatOpenAI (streaming)
  → LangChainAdapter → useChat
```

The system prompt shrinks from 119 lines to persona and response rules only. Facts arrive as
retrieved context.

## Project scope change

The current prompt hardcodes "mention ONLY these three projects" (`route.ts:20-24`), which
permanently hides `build-script` — the strongest project, and the only one with validation data
and a paper under review.

The cap is removed. Any project with a real written case study is eligible, and the retriever
decides relevance per question. The cap exists today only because knowledge is a hardcoded
list; once content is the source of truth it is unnecessary.

## Error handling

- **Retrieval failure or empty selection** falls back to including all documents. With a corpus
  this small the fallback is always affordable, so a bad selection degrades to approach A rather
  than a broken answer. This is what makes B low-risk here.
- **Empty-body documents** fall back to their frontmatter `description` as the body. Filtering
  them out would be a regression: the bot can currently describe Redivo from the hardcoded
  prompt, but `redivo-sleep-app.mdx` has no body, so filtering would make it unmentionable. A
  document is dropped only when both body and description are empty. Writing a real case study
  therefore improves an answer rather than unlocking one.
- **Request validation** is already in place: non-array or empty `messages`, a trailing
  non-user message, and blank content each return 400 with a specific message.
- **Postgres logging** already fails soft — `postgres-callback.ts:49-51` returns early when
  `POSTGRES_URL` is unset, so analytics never block a response.

## Testing

- **Loader unit tests:** parses frontmatter correctly, skips empty bodies, assigns `kind` from
  directory.
- **Retriever unit tests:** a question about Redivo returns the Redivo document; an unrelated
  question does not; failure falls back to all documents.
- **Route tests:** the four validation cases above, plus multi-turn history retention.
- **E2E:** one Playwright test that sends a message and asserts a streamed response.

Testing prerequisites, both currently broken:

- `@playwright/test` is not installed as a dependency (only a global CLI exists).
- `playwright.config.ts` targets port **3002**; the dev server runs on **3000**.

## Staging

1. **Fix the 400** — done 2026-08-02, verified via curl (streaming, multi-turn history, four
   validation cases, clean `tsc --noEmit`). Browser confirmation still outstanding.
2. **Content layer** — extract knowledge from the system prompt and `resume.pdf` into structured
   files; draft the missing case studies from vault material, starting with REDIVO.
3. **Retrieval layer** — loader, retriever, and chain wiring.

Stage 2 genuinely gates stage 3: a retriever over `redivo-sleep-app.mdx` today returns
frontmatter and nothing else.

## Content authoring

Case studies will be drafted from vault material (`~/code/s-vault`, which contains
`06_raw/The Wall - REDIVO App Blocking Plan.md` and research notes on Friction Design,
Behavioral Design, and Interaction Models) in the `build-script.mdx` format, then corrected by
Stefano. No metrics or outcomes will be invented — anything not supported by source material
will be marked for him to fill in.

## Open questions

- Should `content/about/*.mdx` be public-facing pages, or chat-only knowledge files?
- Does the resume PDF get parsed into content, or is its content re-authored by hand?
