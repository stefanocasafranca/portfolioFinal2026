'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ProjectMedia } from '@/utils/project-enricher';
import { usePrefersReducedMotion } from '@/utils/hooks';
import { IoOpenOutline } from 'react-icons/io5';

interface ProjectTileProps {
  project: ProjectMedia;
  onClick: (project: ProjectMedia) => void;
}

export default function ProjectTile({ project, onClick }: ProjectTileProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const mediaUrl = project.media[0];
  const isVideo = mediaUrl?.endsWith('.mov') || mediaUrl?.endsWith('.mp4') || mediaUrl?.endsWith('.webm');

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.9, y: 10 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1, y: 0 }}
      transition={prefersReducedMotion ? {} : { duration: 0.3 }}
      className="my-4"
    >
      <button
        onClick={() => onClick(project)}
        className="block group w-full text-left"
      >
        <div className="relative rounded-lg sm:rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow bg-white/5 backdrop-blur-sm border border-white/20">
          {isVideo ? (
            <video
              src={mediaUrl}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="w-full h-auto max-h-[200px] sm:max-h-[250px] md:max-h-[300px] object-cover"
            />
          ) : (
            <div className="relative w-full aspect-video">
              <Image
                src={mediaUrl || ''}
                alt={project.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 600px"
              />
            </div>
          )}
          <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3">
            <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full bg-black/70 backdrop-blur-sm text-white text-xs sm:text-sm font-medium group-hover:bg-black/90 transition-colors">
              <span className="hidden md:inline">View {project.name}</span>
              <IoOpenOutline className="text-sm sm:text-base" />
            </div>
          </div>
        </div>
      </button>
    </motion.div>
  );
}

