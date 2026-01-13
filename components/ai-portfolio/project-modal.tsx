'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaX, FaArrowRight } from 'react-icons/fa6';
import { usePrefersReducedMotion } from '@/utils/hooks';
import { ProjectMedia } from '@/utils/project-enricher';
import { CustomMDX } from '@/components/ui/mdx';
import Container from '@/components/ui/container';
import GridLayout from '@/components/grid/layout';
import { getProjectLayout } from '@/config/grid';
import ProjectImageWithDownload from '@/components/grid/widgets/project-image-with-download';
import Anchor from '@/components/ui/anchor';

interface ProjectModalProps {
  project: ProjectMedia | null;
  onClose: () => void;
  scrollPosition: number;
  onRestoreScroll: (position: number) => void;
}

interface ProjectData {
  metadata: {
    title: string;
    description: string;
    links?: string;
    images?: string;
    layout?: string;
  };
  content: string;
  slug: string;
}

export default function ProjectModal({ project, onClose, scrollPosition, onRestoreScroll }: ProjectModalProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isLoading, setIsLoading] = useState(true);
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (project) {
      // Lock body scroll when modal is open
      document.body.style.overflow = 'hidden';
      setIsLoading(true);
      setError(null);
      
      // Fetch project data
      fetch(`/api/projects/${project.slug}`)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch project');
          return res.json();
        })
        .then((data) => {
          setProjectData(data);
          setIsLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setIsLoading(false);
        });
    } else {
      document.body.style.overflow = '';
      setProjectData(null);
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [project]);

  const handleClose = () => {
    // Restore scroll position
    onRestoreScroll(scrollPosition);
    onClose();
  };

  if (!project) return null;

  const parsedLinks = projectData?.metadata.links ? JSON.parse(projectData.metadata.links) : [];
  const parsedImages = projectData?.metadata.images ? JSON.parse(projectData.metadata.images) : [];
  const shouldShowLinks = project.slug === 'acc-bioscience-incubator-website-redesign' || project.slug === 'fogo-direto';
  const layout = projectData?.metadata.layout ? getProjectLayout(projectData.metadata.layout) : null;

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={handleClose}
          />
          
          {/* Modal Content */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1, y: 0 }}
            exit={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-4 sm:inset-8 md:inset-12 lg:inset-16 z-50 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with close button */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
              <h2 className="text-lg sm:text-xl font-semibold text-black dark:text-white">
                {projectData?.metadata.title || project.name}
              </h2>
              <button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close modal"
              >
                <FaX className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Project Content */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-red-600 dark:text-red-400">Error loading project: {error}</p>
                </div>
              ) : projectData ? (
                <div className="p-4 sm:p-6 md:p-8">
                  <Container as="article" className="py-4 sm:py-6 md:py-8">
                    <h1 className="font-sf-pro text-2xl sm:text-3xl leading-relaxed mb-4 sm:mb-6">
                      {projectData.metadata.title}
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 pb-6 sm:pb-8">
                      <div>
                        <p className="text-lg sm:text-xl leading-relaxed font-medium mb-4">
                          {projectData.metadata.description}
                        </p>
                        {shouldShowLinks && parsedLinks.length > 0 && (
                          <div className="flex flex-wrap items-center gap-3 pt-4">
                            {parsedLinks.map((link: { url?: string; name: string }, index: number) => (
                              link.url ? (
                                <Anchor
                                  key={`${link.name}-${link.url}-${index}`}
                                  href={link.url}
                                  target="_blank"
                                  rel="noreferrer nofollow noopener"
                                  className="inline-flex px-4 sm:px-5 py-2 sm:py-3 text-sm"
                                >
                                  {link.name}
                                  <FaArrowRight className="ml-2 -rotate-45 transition-transform duration-300 group-hover:rotate-0" />
                                </Anchor>
                              ) : null
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="prose dark:prose-invert max-w-none">
                        <CustomMDX source={projectData.content} />
                      </div>
                    </div>
                  </Container>
                  {parsedImages.length > 0 && layout && (
                    <GridLayout layouts={layout}>
                      {parsedImages.map((image: { i: string; url: string }) => (
                        <div key={image.i}>
                          <ProjectImageWithDownload
                            imageUrl={image.url}
                            alt={`${projectData.metadata.title} - ${image.i}`}
                            showDownload={false}
                            imageId={image.i}
                          />
                        </div>
                      ))}
                    </GridLayout>
                  )}
                </div>
              ) : null}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

