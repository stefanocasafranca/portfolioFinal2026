'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaInfoCircle, FaTimes } from 'react-icons/fa';

const CONSENT_KEY = 'stefano-ai-analytics-consent';

export default function PrivacyBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem(CONSENT_KEY);
    if (!hasConsented) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, 'true');
    setShowBanner(false);
  };

  const handleDismiss = () => {
    // Still set consent as true since using the chat implies consent
    localStorage.setItem(CONSENT_KEY, 'true');
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50"
        >
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-5 backdrop-blur-xl">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <FaInfoCircle className="text-blue-500 text-lg flex-shrink-0 mt-0.5" />
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                  Chat Analytics Notice
                </h3>
              </div>
              <button
                onClick={handleDismiss}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                aria-label="Dismiss banner"
              >
                <FaTimes />
              </button>
            </div>

            {/* Content */}
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
              This AI chat logs conversations to help improve responses and understand what visitors are asking about.
              By using this chat, you consent to anonymous conversation logging.
            </p>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleAccept}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                I Understand
              </button>
              <a
                href="https://github.com/stefanocasafranca"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
              >
                Learn More
              </a>
            </div>

            {/* Fine print */}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
              We collect: messages, timestamps, and basic analytics. We never share your data.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
