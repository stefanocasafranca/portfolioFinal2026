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
                    ? `### ${doc.title} (slug: ${doc.slug}${formatCategories(doc.categories)})`
                    : `### ${doc.title}`;
            return `${header}\n${formatBody(doc)}`;
        })
        .join('\n\n---\n\n');
}

/**
 * A document whose body fell back to its description has no written case study.
 * Rendering both would repeat the same sentence twice and make a stub look
 * substantial, which is exactly when the model starts inventing process and
 * motivation to fill the requested length. Say so in the data instead: a
 * constraint sitting next to the evidence holds better than one in the rules.
 */
function formatBody(doc: KnowledgeDoc): string {
    const isStub = doc.body.trim() === doc.description.trim();

    if (!isStub) return `${doc.description}\n\n${doc.body}`;

    return `${doc.description}\n\n[NO WRITE-UP EXISTS for this project. The single sentence above is the ONLY information available about it. Do not describe its process, methods, motivation, research, iterations, or outcomes - none of that is known. State the one sentence, say the full write-up is not published yet, and offer a project that has more depth.]`;
}

/**
 * Rendered inline in the project header so the model can group projects by
 * area (AI Engineering, UX Research, Product and Design, Industrial Design)
 * without needing a separate lookup structure.
 */
function formatCategories(categories: string[]): string {
    if (categories.length === 0) return '';
    return `, categories: ${categories.join(', ')}`;
}
