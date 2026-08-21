'use client';

import { useBackToTop } from '@/hooks/useBackToTop';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronUp } from 'react-icons/fa';

export default function BackToTop() {
  const { isVisible, scrollToTop } = useBackToTop(500);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          onClick={scrollToTop}
          className="fixed bottom-5 right-4 z-50 w-12 h-12 bg-gray-700/80 backdrop-blur-sm text-gray-400 border border-gray-600 rounded-lg hover:opacity-0.5 no-print"
          aria-label="Back to top"
          title="Back to top"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}>
          <FaChevronUp className="w-5 h-5 mx-auto" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
