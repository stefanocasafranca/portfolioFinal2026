'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { IoOpenOutline } from 'react-icons/io5';

interface ProjectMedia {
  slug: string;
  title: string;
  mediaUrl: string;
  mediaType: 'video' | 'image';
  link: string;
}

const PROJECT_MEDIA: Record<string, ProjectMedia> = {
  redivo: {
    slug: 'redivo-sleep-app',
    title: 'Redivo Sleep App',
    mediaUrl: '/projects/redivo/Sleeping_Girl_Video_Generation.mp4',
    mediaType: 'video',
    link: '/projects/redivo-sleep-app',
  },
  'redivo sleep app': {
    slug: 'redivo-sleep-app',
    title: 'Redivo Sleep App',
    mediaUrl: '/projects/redivo/Sleeping_Girl_Video_Generation.mp4',
    mediaType: 'video',
    link: '/projects/redivo-sleep-app',
  },
  'ux research': {
    slug: 'ux-research',
    title: 'UX Research',
    mediaUrl: '/projects/ux-research/images-1.png',
    mediaType: 'image',
    link: '/projects/ux-research',
  },
  'code learning evolution': {
    slug: 'cle',
    title: 'Code Learning Evolution',
    mediaUrl: '/projects/cle/video-9.mov',
    mediaType: 'video',
    link: '/projects/cle',
  },
  cle: {
    slug: 'cle',
    title: 'Code Learning Evolution',
    mediaUrl: '/projects/cle/video-9.mov',
    mediaType: 'video',
    link: '/projects/cle',
  },
  'acc bioscience': {
    slug: 'acc-bioscience-incubator-website-redesign',
    title: 'ACC Bioscience Incubator',
    mediaUrl: '/projects/abi/images-1.png',
    mediaType: 'image',
    link: '/projects/acc-bioscience-incubator-website-redesign',
  },
  'fogo direto': {
    slug: 'fogo-direto',
    title: 'Fogo Direto',
    mediaUrl: '/projects/fogo-direto/images-1.png',
    mediaType: 'image',
    link: '/projects/fogo-direto',
  },
};

export function detectProjectsInMessage(message: string): ProjectMedia[] {
  const lowerMessage = message.toLowerCase();
  const detected: ProjectMedia[] = [];
  const found = new Set<string>();

  // Check for project mentions
  for (const [key, project] of Object.entries(PROJECT_MEDIA)) {
    if (lowerMessage.includes(key) && !found.has(project.slug)) {
      detected.push(project);
      found.add(project.slug);
    }
  }

  return detected;
}

interface ProjectMediaDisplayProps {
  projects: ProjectMedia[];
}

export default function ProjectMediaDisplay({ projects }: ProjectMediaDisplayProps) {
  if (projects.length === 0) return null;

  return (
    <div className="mt-4 space-y-3">
      {projects.map((project) => (
        <motion.div
          key={project.slug}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-xl overflow-hidden border border-white/20 bg-white/5 backdrop-blur-sm"
        >
          <div className="relative aspect-video w-full max-w-md">
            {project.mediaType === 'video' ? (
              <video
                src={project.mediaUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src={project.mediaUrl}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
              />
            )}
          </div>
          <div className="p-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm sm:text-base text-black dark:text-white">
                {project.title}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                View full project
              </p>
            </div>
            <Link
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-sm font-medium hover:from-purple-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              <span>View Project</span>
              <IoOpenOutline className="text-base" />
            </Link>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

