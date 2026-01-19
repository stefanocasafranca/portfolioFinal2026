'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa6';
import Image from 'next/image';
import CursorBackground from './cursor-background';
import Header from '../ui/header';
import AIPortfolioNavigation from './navigation';
import PrivacyBanner from './privacy-banner';
import { usePrefersReducedMotion } from '@/utils/hooks';
import { useChatbot } from '@/utils/hooks/use-chatbot';
import { enrichMessage, EnrichedMessagePart, PROJECTS, ProjectMedia } from '@/utils/project-enricher';
import ProjectTile from './project-tile';
import ProjectModal from './project-modal';
import Link from 'next/link';

export default function AIPortfolio() {
  const [query, setQuery] = useState('');
  const prefersReducedMotion = usePrefersReducedMotion();
  const { messages, isLoading, error, sendMessage } = useChatbot();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectMedia | null>(null);
  const [savedScrollPosition, setSavedScrollPosition] = useState(0);

  // Auto-scroll to bottom when new messages arrive - throttled to prevent performance issues
  useEffect(() => {
    if (!messagesEndRef.current || selectedProject || isLoading) return;
    
    // Throttle scroll to prevent excessive calls during streaming
    const timeoutId = setTimeout(() => {
      if (messagesEndRef.current && !selectedProject) {
        try {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        } catch (err) {
          // Fallback for mobile browsers that may have issues with smooth scroll
          if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'auto', block: 'end' });
          }
        }
      }
    }, 100); // Small delay to batch rapid updates

    return () => clearTimeout(timeoutId);
  }, [messages.length, selectedProject, isLoading]);

  // Handle project tile click - save scroll position and open modal
  const handleProjectClick = (project: ProjectMedia) => {
    if (scrollContainerRef.current) {
      setSavedScrollPosition(scrollContainerRef.current.scrollTop);
    }
    setSelectedProject(project);
  };

  // Handle modal close - restore scroll position
  const handleModalClose = () => {
    setSelectedProject(null);
    // Restore scroll position after a brief delay to ensure DOM is ready
    // Use requestAnimationFrame for better mobile performance
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (scrollContainerRef.current) {
          try {
            scrollContainerRef.current.scrollTop = savedScrollPosition;
          } catch (err) {
            // Silently fail if scroll restoration fails on mobile
            console.warn('Scroll restoration failed:', err);
          }
        }
      }, 150);
    });
  };

  const handleRestoreScroll = (position: number) => {
    // Use requestAnimationFrame for better mobile performance
    requestAnimationFrame(() => {
      if (scrollContainerRef.current) {
        try {
          scrollContainerRef.current.scrollTop = position;
        } catch (err) {
          // Silently fail if scroll restoration fails on mobile
          console.warn('Scroll restoration failed:', err);
        }
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      await sendMessage(query);
      setQuery('');
    }
  };

  return (
    <motion.div 
      className="h-screen flex flex-col relative overflow-hidden"
      initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
      exit={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
      transition={prefersReducedMotion ? {} : { duration: 0.5 }}
    >
      {/* Cursor-reactive background */}
      <CursorBackground />

      {/* Fixed Header - Top Center at all breakpoints */}
      <div className="fixed top-0 left-0 right-0 z-30 bg-gradient-to-b from-white/80 dark:from-gray-900/80 to-transparent backdrop-blur-sm">
        <div className="max-w-[1200px] max-lg:max-w-[800px] max-md:max-w-[375px] max-sm:max-w-[320px] mx-auto px-4 py-4 sm:py-6">
          <div className="flex justify-center">
            <div className="inline-flex">
              <Header />
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Messages Area */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto pt-16 sm:pt-20 md:pt-24 pb-28 sm:pb-32 md:pb-40 relative z-10 scroll-smooth"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="min-h-full flex flex-col items-center justify-start">
          {messages.length === 0 ? (
            <div className="w-full max-w-[1200px] max-lg:max-w-[800px] max-md:max-w-[375px] max-sm:max-w-[320px] mx-auto px-4 py-8 sm:py-12 md:py-16 flex flex-col items-center justify-center space-y-4 sm:space-y-6 min-h-full">
            {/* Logo - Centered below toggle */}
            <motion.div
              className="flex justify-center"
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              transition={prefersReducedMotion ? {} : { delay: 0.3, duration: 0.5 }}
            >
              <div className="w-16 h-16 lg:w-20 lg:h-20 relative">
                <Image
                  src="/images/personalLogoWhite.png"
                  alt="Stefano Casafranca's Personal Logo"
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 1024px) 64px, 80px"
                />
              </div>
            </motion.div>

            {/* Welcome Section - Compact */}
            <motion.div
              className="text-center space-y-3"
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              transition={prefersReducedMotion ? {} : { delay: 0.4, duration: 0.6 }}
            >
              <div className="text-lg font-medium text-slate-700 dark:text-slate-300">
                Hey, I&apos;m Stefano 👋
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black dark:text-white">
                AI Portfolio
              </h1>
            </motion.div>

            {/* Hero Memoji - Responsive clamp sizing */}
            <motion.div
              className="relative"
              initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.8, y: 20 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1, y: 0 }}
              transition={prefersReducedMotion ? {} : { delay: 0.6, duration: 0.8, type: "spring", bounce: 0.3 }}
            >
              <div
                className="relative"
                style={{
                  width: 'clamp(120px, 18vw, 220px)',
                  height: 'clamp(120px, 18vw, 220px)'
                }}
              >
                <Image
                  src="/images/Stefano-memoji.png"
                  alt="Stefano's 3D Memoji Avatar - AI Portfolio Representation"
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 640px) 200px, (max-width: 1024px) 300px, 380px"
                />
              </div>
            </motion.div>
            </div>
          ) : (
            <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-3 sm:space-y-4">
            {messages.map((msg, index) => {
              if (msg.role === 'user') {
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex justify-end"
                  >
                    <div className="max-w-[85%] sm:max-w-[80%] px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
                      <p className="text-sm sm:text-base whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    </div>
                  </motion.div>
                );
              }

              // Enrich assistant messages with project tiles
              const enrichedParts = enrichMessage(msg.content);

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col justify-start space-y-2"
                >
                  {enrichedParts.map((part, partIndex) => {
                    if (part.type === 'text') {
                      // Make project names clickable links
                      let processedContent = part.content || '';
                      PROJECTS.forEach((project: { name: string; id: string; slug: string; link: string }) => {
                        const regex = new RegExp(`\\b(${project.name}|${project.id}|${project.slug.replace(/-/g, ' ')})\\b`, 'gi');
                        processedContent = processedContent.replace(regex, (match) => {
                          return `[PROJECT_LINK:${project.link}:${match}]`;
                        });
                      });

                      // Split by project links and render
                      const linkRegex = /\[PROJECT_LINK:([^:]+):([^\]]+)\]/g;
                      const segments: (string | { link: string; text: string })[] = [];
                      let lastIndex = 0;
                      let match;

                      while ((match = linkRegex.exec(processedContent)) !== null) {
                        // Add text before link
                        if (match.index > lastIndex) {
                          segments.push(processedContent.substring(lastIndex, match.index));
                        }
                        // Add link
                        segments.push({ link: match[1], text: match[2] });
                        lastIndex = match.index + match[0].length;
                      }
                      // Add remaining text
                      if (lastIndex < processedContent.length) {
                        segments.push(processedContent.substring(lastIndex));
                      }

                      // If no links found, use original content
                      if (segments.length === 0) {
                        segments.push(processedContent);
                      }

                      return (
                        <div
                          key={partIndex}
                          className="max-w-[85%] sm:max-w-[80%] px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-white/10 backdrop-blur-sm text-black dark:text-white border border-white/20"
                        >
                          <p className="text-sm sm:text-base whitespace-pre-wrap leading-relaxed">
                            {segments.map((segment, segIndex) => {
                              if (typeof segment === 'string') {
                                return <span key={segIndex}>{segment}</span>;
                              } else {
                                return (
                                  <Link
                                    key={segIndex}
                                    href={segment.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-semibold text-purple-400 hover:text-purple-300 underline decoration-2 underline-offset-2 transition-colors"
                                  >
                                    {segment.text}
                                  </Link>
                                );
                              }
                            })}
                          </p>
                        </div>
                      );
                    } else if (part.type === 'project-tile' && part.project) {
                      return <ProjectTile key={partIndex} project={part.project} onClick={handleProjectClick} />;
                    }
                    return null;
                  })}
                </motion.div>
              );
            })}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-2xl">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </motion.div>
            )}
            {/* Scroll anchor for auto-scroll */}
            <div ref={messagesEndRef} className="h-4" />
            </div>
          )}
        </div>
      </div>

      {/* Fixed Bottom Section - Input and Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-white/95 dark:from-gray-900/95 via-white/90 dark:via-gray-900/90 to-transparent backdrop-blur-md border-t border-white/20 dark:border-white/10 shadow-lg">
        {/* Chat Input - Fixed at bottom */}
        <div className="max-w-[1200px] max-lg:max-w-[800px] max-md:max-w-[375px] max-sm:max-w-[320px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-3 sm:pt-4 pb-2">
          {error && (
            <div className="mb-3 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-600 dark:text-red-400 text-xs sm:text-sm">
              {error}
            </div>
          )}
          <motion.form
            onSubmit={handleSubmit}
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={prefersReducedMotion ? {} : { delay: 0.8, duration: 0.6 }}
          >
            <div className="relative backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-full p-1 shadow-xl">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask me anything..."
                disabled={isLoading}
                className="w-full px-4 sm:px-6 md:px-8 py-3 sm:py-4 pr-12 sm:pr-16 text-base sm:text-lg bg-transparent text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 rounded-full disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-gradient-to-r from-purple-500 to-indigo-600 backdrop-blur-sm text-white rounded-full hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                aria-label="Submit query"
              >
                <FaArrowRight className="text-sm sm:text-base" />
              </button>
            </div>
          </motion.form>
        </div>

        {/* AI Portfolio Navigation - Fixed below input */}
        <div className="max-w-[1200px] max-lg:max-w-[800px] max-md:max-w-[375px] max-sm:max-w-[320px] mx-auto px-4 pb-3 sm:pb-4">
          <AIPortfolioNavigation 
            onQuestionSelect={(question) => {
              setQuery(question);
              // Focus the input after a short delay to ensure it's rendered
              setTimeout(() => {
                const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                input?.focus();
                // Scroll input into view on mobile - use auto behavior to prevent crashes
                try {
                  input?.scrollIntoView({ behavior: 'auto', block: 'center' });
                } catch (err) {
                  // Silently fail if scroll fails on mobile
                  console.warn('Input scroll failed:', err);
                }
              }, 100);
            }}
          />
        </div>
      </div>

      {/* Privacy/Analytics Consent Banner */}
      <PrivacyBanner />

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={handleModalClose}
        scrollPosition={savedScrollPosition}
        onRestoreScroll={handleRestoreScroll}
      />
    </motion.div>
  );
}