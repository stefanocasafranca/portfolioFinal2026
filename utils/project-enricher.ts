// Project mapping with media files and links
export interface ProjectMedia {
  id: string;
  name: string;
  slug: string;
  media: string[]; // Array of media file paths
  link: string; // Portfolio page link
}

export const PROJECTS: ProjectMedia[] = [
  {
    id: 'redivo',
    name: 'Redivo Sleep App',
    slug: 'redivo-sleep-app',
    media: ['/projects/redivo/Final_Sleeping_Girl_Video_Generation.mov'],
    link: '/projects/redivo-sleep-app',
  },
  {
    id: 'ux-research',
    name: 'UX Research',
    slug: 'ux-research',
    media: ['/projects/ux-research/images-1.png'],
    link: '/projects/ux-research',
  },
  {
    id: 'cle',
    name: 'Code Learning Evolution',
    slug: 'cle',
    media: ['/projects/cle/images-1.png'],
    link: '/projects/cle',
  },
  {
    id: 'acc-bioscience',
    name: 'ACC Bioscience Incubator',
    slug: 'acc-bioscience-incubator-website-redesign',
    media: ['/projects/abi/images-1.png'],
    link: '/projects/acc-bioscience-incubator-website-redesign',
  },
  {
    id: 'fogo-direto',
    name: 'Fogo Direto',
    slug: 'fogo-direto',
    media: ['/projects/fogo-direto/images-1.png'],
    link: '/projects/fogo-direto',
  },
];

// Detect project mentions in text
export function detectProjectMentions(text: string): { project: ProjectMedia; position: number; length: number }[] {
  const mentions: { project: ProjectMedia; position: number; length: number }[] = [];
  const lowerText = text.toLowerCase();

  PROJECTS.forEach((project) => {
    // Check for various ways the project might be mentioned
    const patterns = [
      { text: project.name.toLowerCase(), length: project.name.length },
      { text: project.id.toLowerCase(), length: project.id.length },
      { text: project.slug.toLowerCase().replace(/-/g, ' '), length: project.slug.replace(/-/g, ' ').length },
      // Also check for common variations
      { text: 'redivo', length: 6 },
      { text: 'cle', length: 3 },
      { text: 'code learning evolution', length: 22 },
      { text: 'ux research', length: 11 },
      { text: 'acc bioscience', length: 14 },
      { text: 'fogo direto', length: 11 },
    ].filter(p => {
      // Only include patterns that match this project
      const projectPatterns = [
        project.name.toLowerCase(),
        project.id.toLowerCase(),
        project.slug.toLowerCase().replace(/-/g, ' '),
      ];
      return projectPatterns.some(pp => p.text.includes(pp) || pp.includes(p.text));
    });

    patterns.forEach((pattern) => {
      let searchIndex = 0;
      while (true) {
        const index = lowerText.indexOf(pattern.text, searchIndex);
        if (index === -1) break;

        // Check if it's a whole word (not part of another word)
        const before = index > 0 ? lowerText[index - 1] : ' ';
        const after = index + pattern.length < lowerText.length ? lowerText[index + pattern.length] : ' ';
        const isWordBoundary = /[\s.,!?;:]/.test(before) && /[\s.,!?;:]/.test(after);

        if (isWordBoundary || index === 0) {
          // Avoid duplicates
          if (!mentions.some((m) => m.project.id === project.id && Math.abs(m.position - index) < 10)) {
            mentions.push({ project, position: index, length: pattern.length });
            break; // Only take first match per project
          }
        }

        searchIndex = index + 1;
      }
    });
  });

  // Sort by position in text
  return mentions.sort((a, b) => a.position - b.position);
}

// Enrich message with project tiles
export interface EnrichedMessagePart {
  type: 'text' | 'project-tile';
  content?: string;
  project?: ProjectMedia;
}

// Find the start of the paragraph containing the given position
function findParagraphStart(text: string, position: number): number {
  // Look backwards for paragraph break (double newline) or start of text
  for (let i = position - 1; i >= 0; i--) {
    // Check for double newline (paragraph break)
    if (i > 0 && text[i] === '\n' && text[i - 1] === '\n') {
      return i + 1; // Start after the double newline
    }
    // If we've gone back too far (more than 500 chars), stop
    if (position - i > 500) {
      break;
    }
  }
  return 0; // Start of text
}

// Find the end of the paragraph containing the given position
function findParagraphEnd(text: string, position: number, maxLookAhead: number = 1000): number {
  // Look forward for paragraph break (double newline) or end of text
  const searchEnd = Math.min(position + maxLookAhead, text.length);
  for (let i = position; i < searchEnd; i++) {
    // Check for double newline (paragraph break)
    if (i + 1 < text.length && text[i] === '\n' && text[i + 1] === '\n') {
      return i + 1; // Include the first newline
    }
  }
  // If no paragraph break found, return the max lookahead or end of text
  return Math.min(position + maxLookAhead, text.length);
}

// Check if a paragraph is an intro paragraph (just lists projects without detailed explanation)
function isIntroParagraph(paragraphText: string): boolean {
  const lowerText = paragraphText.toLowerCase();
  
  // Check for intro phrases that indicate this is just listing projects
  const introPhrases = [
    /i'll focus on (my )?(three|most important|standout) projects/i,
    /my (three|most important|standout) projects (are|is)/i,
    /i'd love to share/i,
    /absolutely! my/i,
    /let me share/i,
    /here (are|is) (my )?(three|most important)/i,
  ];
  
  // If it matches intro phrases and is relatively short (< 300 chars), it's likely an intro
  const hasIntroPhrase = introPhrases.some(phrase => phrase.test(lowerText));
  const isShort = paragraphText.length < 300;
  
  // Count how many different projects are mentioned
  let projectMentionCount = 0;
  PROJECTS.forEach(project => {
    const projectName = project.name.toLowerCase();
    if (lowerText.includes(projectName)) {
      projectMentionCount++;
    }
  });
  
  // If it has intro phrase, is short, and mentions 2+ projects, it's an intro paragraph
  return hasIntroPhrase && isShort && projectMentionCount >= 2;
}

// Group project mentions by the paragraph they belong to
function groupMentionsByParagraph(
  content: string,
  mentions: { project: ProjectMedia; position: number; length: number }[]
): Array<{ paragraphStart: number; paragraphEnd: number; projects: ProjectMedia[]; isIntro: boolean }> {
  const paragraphGroups: Array<{ paragraphStart: number; paragraphEnd: number; projects: ProjectMedia[]; isIntro: boolean }> = [];
  const processedPositions = new Set<number>();

  mentions.forEach((mention) => {
    // Skip if we've already processed a mention near this position
    if (processedPositions.has(mention.position)) {
      return;
    }

    // Find the paragraph containing this mention
    const paragraphStart = findParagraphStart(content, mention.position);
    const mentionEnd = mention.position + mention.length;
    
    // Calculate max lookahead (don't go past next project if exists)
    let maxLookAhead = 1000;
    const nextMention = mentions.find(m => m.position > mentionEnd);
    if (nextMention) {
      maxLookAhead = Math.min(1000, nextMention.position - mentionEnd - 20);
    }
    
    const paragraphEnd = findParagraphEnd(content, mentionEnd, maxLookAhead);
    const paragraphText = content.substring(paragraphStart, paragraphEnd);
    const isIntro = isIntroParagraph(paragraphText);

    // Check if we already have a group for this paragraph (within 50 chars tolerance)
    const existingGroup = paragraphGroups.find(
      group => Math.abs(group.paragraphStart - paragraphStart) < 50
    );

    if (existingGroup) {
      // Add this project to existing group if not already there
      if (!existingGroup.projects.some(p => p.id === mention.project.id)) {
        existingGroup.projects.push(mention.project);
      }
      // Update end position if this mention extends further
      if (paragraphEnd > existingGroup.paragraphEnd) {
        existingGroup.paragraphEnd = paragraphEnd;
      }
    } else {
      // Create new group
      paragraphGroups.push({
        paragraphStart,
        paragraphEnd,
        projects: [mention.project],
        isIntro,
      });
    }

    // Mark this position as processed
    processedPositions.add(mention.position);
  });

  // Sort groups by position
  return paragraphGroups.sort((a, b) => a.paragraphStart - b.paragraphStart);
}

export function enrichMessage(content: string): EnrichedMessagePart[] {
  const parts: EnrichedMessagePart[] = [];
  const mentions = detectProjectMentions(content);

  if (mentions.length === 0) {
    // No projects mentioned, return as plain text
    return [{ type: 'text', content }];
  }

  // Group mentions by paragraph
  const paragraphGroups = groupMentionsByParagraph(content, mentions);
  
  // Track which projects have already received tiles to prevent duplicates
  const projectsWithTiles = new Set<string>();

  let lastIndex = 0;

  paragraphGroups.forEach((group, index) => {
    // Add text before this paragraph (if any)
    if (group.paragraphStart > lastIndex) {
      const textBefore = content.substring(lastIndex, group.paragraphStart);
      if (textBefore.trim()) {
        parts.push({ type: 'text', content: textBefore });
      }
    }

    // Extract the complete paragraph containing the project mention(s)
    const paragraphText = content.substring(group.paragraphStart, group.paragraphEnd).trim();
    if (paragraphText) {
      parts.push({ type: 'text', content: paragraphText });
    }

    // Add project tiles AFTER the complete paragraph
    // Skip tiles for intro paragraphs (they just list projects, not explain them)
    // Only add tiles for projects that haven't been shown yet (prevent duplicates)
    if (!group.isIntro) {
      group.projects.forEach((project) => {
        if (!projectsWithTiles.has(project.id)) {
          parts.push({ type: 'project-tile', project });
          projectsWithTiles.add(project.id);
        }
      });
    }

    lastIndex = group.paragraphEnd;
  });

  // Add remaining text after last paragraph
  if (lastIndex < content.length) {
    const remainingText = content.substring(lastIndex);
    if (remainingText.trim()) {
      parts.push({ type: 'text', content: remainingText });
    }
  }

  return parts;
}

