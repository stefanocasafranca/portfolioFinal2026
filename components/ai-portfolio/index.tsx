'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa6';
import Image from 'next/image';
import CursorBackground from './cursor-background';
import Header from '../ui/header';
import AIPortfolioNavigation from './navigation';
import PrivacyBanner from './privacy-banner';
import { usePrefersReducedMotion } from '@/utils/hooks';
import { useChatbot } from '@/utils/hooks/use-chatbot';

export default function AIPortfolio() {
  const [query, setQuery] = useState('');
  const prefersReducedMotion = usePrefersReducedMotion();
  const { messages, isLoading, error, sendMessage } = useChatbot();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (trimmedQuery && !isLoading) {
      await sendMessage(trimmedQuery);
      setQuery('');
    }
  };

  const shouldReduceMotion = prefersReducedMotion === true;

  return (
    <motion.div 
      className="h-screen flex flex-col relative overflow-hidden"
      initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.95 }}
      animate={shouldReduceMotion ? {} : { opacity: 1, scale: 1 }}
      exit={shouldReduceMotion ? {} : { opacity: 0, scale: 0.95 }}
      transition={shouldReduceMotion ? {} : { duration: 0.5 }}
    >
      {/* Cursor-reactive background */}
      <CursorBackground />

      {/* Toggle - Top Center at all breakpoints */}
      <div className="max-w-[1200px] max-lg:max-w-[800px] max-md:max-w-[375px] max-sm:max-w-[320px] mx-auto px-4 py-6 relative z-20">
        <div className="flex justify-center">
          <div className="inline-flex">
            <Header />
          </div>
        </div>
      </div>

      {/* Main Content - Constrained width for content, but not input */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center space-y-4 sm:space-y-6 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="max-w-[1200px] max-lg:max-w-[800px] max-md:max-w-[375px] max-sm:max-w-[320px] mx-auto px-4 flex flex-col items-center space-y-4 sm:space-y-6">
            {/* Logo - Centered below toggle */}
            <motion.div
              className="flex justify-center"
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
              animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              transition={shouldReduceMotion ? {} : { delay: 0.3, duration: 0.5 }}
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
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
              animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              transition={shouldReduceMotion ? {} : { delay: 0.4, duration: 0.6 }}
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
              initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.8, y: 20 }}
              animate={shouldReduceMotion ? {} : { opacity: 1, scale: 1, y: 0 }}
              transition={shouldReduceMotion ? {} : { delay: 0.6, duration: 0.8, type: "spring", bounce: 0.3 }}
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
          <div className="w-full max-w-3xl mx-auto px-4 py-6 space-y-4">
            {messages.map((msg, index) => (
              <motion.div
                key={`${msg.role}-${index}-${msg.content.substring(0, 20)}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-6 py-3 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white'
                      : 'bg-white/10 backdrop-blur-sm text-black dark:text-white border border-white/20'
                  }`}
                >
                  <p className="text-sm sm:text-base whitespace-pre-wrap">{msg.content}</p>
                </div>
              </motion.div>
            ))}
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
          </div>
        )}

        {/* Chat Input - Wide but not too wide, about 1/5 smaller */}
        <motion.form
          onSubmit={handleSubmit}
          className="w-full max-w-5xl px-6 sm:px-12 md:px-16 lg:px-20"
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
          animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          transition={shouldReduceMotion ? {} : { delay: 0.8, duration: 0.6 }}
        >
          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}
          <div className="relative backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-full p-1 shadow-xl">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask me anything..."
              disabled={isLoading}
              className="w-full px-8 py-4 pr-16 text-lg bg-transparent text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 rounded-full disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-gradient-to-r from-purple-500 to-indigo-600 backdrop-blur-sm text-white rounded-full hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              aria-label="Submit query"
            >
              <FaArrowRight className="text-base" />
            </button>
          </div>
        </motion.form>
      </div>

      {/* AI Portfolio Navigation - Using grid rails */}
      <div className="relative z-10 max-w-[1200px] max-lg:max-w-[800px] max-md:max-w-[375px] max-sm:max-w-[320px] mx-auto px-4 py-4">
        <AIPortfolioNavigation />
      </div>

      {/* Privacy/Analytics Consent Banner */}
      <PrivacyBanner />
    </motion.div>
  );
}