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
