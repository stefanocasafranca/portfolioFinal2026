'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight, FaRotateRight } from 'react-icons/fa6';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CursorBackground from './cursor-background';
import Header from '../ui/header';
import { usePrefersReducedMotion } from '@/utils/hooks';
import { useChatbot } from '@/utils/hooks/use-chatbot';
import PrivacyBanner from './privacy-banner';

const QUICK_ACTIONS = [
  "Tell me about your projects",
  "What's your background?",
  "How do you approach UX research?",
  "Are you looking for work?"
];

export default function AIPortfolio() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { 
    messages, 
    isLoading, 
    error, 
    sendMessage, 
    input, 
    handleInputChange, 
    handleSubmit,
    clearMessages 
  } = useChatbot();

  const handleQuickAction = (action: string) => {
    if (!isLoading) {
      sendMessage(action);
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
          <div className="inline-flex items-center gap-4">
            <Header />
            {messages.length > 0 && (
              <button
                onClick={clearMessages}
                className="p-2 text-slate-500 hover:text-black dark:hover:text-white transition-colors"
                title="Clear Chat"
              >
                <FaRotateRight className={`text-sm ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content - Constrained width for content, but not input */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-start space-y-4 sm:space-y-6 overflow-y-auto pt-8">
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
          <div className="w-full max-w-3xl mx-auto px-4 py-6 space-y-6">
            {messages.map((msg: any, index: number) => (
              <motion.div
                key={`${msg.role}-${index}-${msg.content.substring(0, 20)}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[90%] px-6 py-3 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white'
                      : 'bg-white/10 backdrop-blur-sm text-black dark:text-white border border-white/20'
                  }`}
                >
                  <div className="text-sm sm:text-base prose dark:prose-invert prose-p:leading-relaxed prose-headings:mb-2 prose-headings:mt-4 first:prose-headings:mt-0 max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            ))}
            {isLoading && messages.length > 0 && !messages[messages.length - 1]?.content && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex justify-start"
              >
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-4 rounded-2xl flex items-center space-x-2">
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    className="w-2 h-2 bg-indigo-500 rounded-full" 
                  />
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                    className="w-2 h-2 bg-purple-500 rounded-full" 
                  />
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: 0.4 }}
                    className="w-2 h-2 bg-blue-500 rounded-full" 
                  />
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 ml-2 animate-pulse">
                    Thinking...
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Quick Actions & Input Area */}
        <div className="w-full max-w-5xl mt-auto pb-8">
            {/* Quick Actions */}
            <motion.div 
                className="flex flex-wrap justify-center gap-2 mb-4 px-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
            >
                {QUICK_ACTIONS.map((action) => (
                    <button
                        key={action}
                        onClick={() => handleQuickAction(action)}
                        disabled={isLoading}
                        className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white transition-all disabled:opacity-50 whitespace-nowrap"
                    >
                        {action}
                    </button>
                ))}
            </motion.div>

            {/* Chat Input */}
            <motion.form
                onSubmit={(e) => {
                    e.preventDefault();
                    if (!isLoading && input.trim()) {
                        handleSubmit(e);
                    }
                }}
                className="px-6 sm:px-12 md:px-16 lg:px-20"
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
                animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
            >
                {error && (
                    <div className="mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-600 dark:text-red-400 text-sm">
                        {error}
                    </div>
                )}
                <div className="relative backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-full p-1 shadow-xl">
                    <input
                        type="text"
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Ask me anything..."
                        disabled={isLoading}
                        className="w-full px-8 py-4 pr-16 text-lg bg-transparent text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 rounded-full disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-gradient-to-r from-purple-500 to-indigo-600 backdrop-blur-sm text-white rounded-full hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        aria-label="Submit query"
                    >
                        <FaArrowRight className="text-base" />
                    </button>
                </div>
            </motion.form>
        </div>
      </div>

      {/* Privacy/Analytics Consent Banner */}
      <PrivacyBanner />
    </motion.div>
  );
}
