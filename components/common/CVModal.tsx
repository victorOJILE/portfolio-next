'use client';

import { Component, ReactNode, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, useReducedMotion } from 'framer-motion';
import { FaCheck, FaDownload, FaLink, FaTimes } from 'react-icons/fa';
import { trackCopyCVLink, trackDownloadCV } from '@/lib/firebase/analytics';

export const CV_URL = '/victor_ojile_cv.pdf';
const CV_FILENAME = 'victor_ojile_cv.pdf';

// react-pdf + pdf.js are only fetched when the modal actually mounts.
const PDFViewer = dynamic(() => import('./PDFViewer'), {
  ssr: false,
  loading: () => <p className="py-20 text-center text-gray-400">Loading CV…</p>,
});

const iconButton =
  'flex h-10 w-10 items-center justify-center rounded text-gray-300 transition-colors hover:bg-white/10 hover:text-white';

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for insecure contexts / older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.readOnly = true;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, text.length);
    try {
      return document.execCommand('copy');
    } catch {
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }
}

function Fallback() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="text-gray-300">
        Your browser couldn&apos;t display the CV here. You can download it instead.
      </p>
      <a
        href={CV_URL}
        download={CV_FILENAME}
        onClick={() => trackDownloadCV('fallback')}
        className="btn-primary inline-flex items-center gap-3">
        <FaDownload />
        <strong>Download CV</strong>
      </a>
    </div>
  );
}

// Catches failures that happen outside react-pdf's own callbacks
// (e.g. the pdf.js chunk failing to load or an unsupported browser).
class PDFErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    return this.state.hasError ? <Fallback /> : this.props.children;
  }
}

export default function CVModal({ onClose }: { onClose: () => void }) {
  const [failed, setFailed] = useState(false);
  const [copied, setCopied] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const copiedTimer = useRef<number>();
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    document.addEventListener('keydown', onKeyDown);

    // Lock page scroll without the page (or fixed header) jumping sideways
    // when the scrollbar disappears on desktop.
    const html = document.documentElement;
    const previousOverflow = document.body.style.overflow;
    const previousGutter = html.style.scrollbarGutter;
    html.style.scrollbarGutter = 'stable';
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      html.style.scrollbarGutter = previousGutter;
      window.clearTimeout(copiedTimer.current);
    };
  }, []);

  const handleCopyLink = async () => {
    const link = `${window.location.origin}${window.location.pathname}?cv=open`;
    if (!(await copyToClipboard(link))) return;
    trackCopyCVLink();
    setCopied(true);
    window.clearTimeout(copiedTimer.current);
    copiedTimer.current = window.setTimeout(() => setCopied(false), 2000);
  };

  const hiddenScale = reduceMotion ? 1 : 0.95;

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-0 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Victor Ojile's CV"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: hiddenScale }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: hiddenScale }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        // Full-screen on phones, floating card from `sm` up
        className="flex h-full w-full max-w-4xl flex-col overflow-hidden bg-dark-300 shadow-2xl sm:max-h-[92vh] sm:rounded-xl sm:border sm:border-gray-700">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-2 border-b border-gray-700 py-1.5 pl-4 pr-2">
          <h2 className="min-w-0 truncate font-bold text-white">Victor Ojile — CV</h2>
          <div className="flex shrink-0 items-center">
            <button
              type="button"
              onClick={handleCopyLink}
              className={`${iconButton} ${copied ? 'text-green-400 hover:text-green-400' : ''}`}
              aria-label="Copy link to CV"
              title={copied ? 'Link copied' : 'Copy link to CV'}>
              {copied ? <FaCheck className="text-lg" /> : <FaLink className="text-lg" />}
            </button>
            <span className="sr-only" role="status">
              {copied ? 'Link copied to clipboard' : ''}
            </span>
            <a
              href={CV_URL}
              download={CV_FILENAME}
              onClick={() => trackDownloadCV('modal')}
              className={iconButton}
              aria-label="Download CV"
              title="Download CV">
              <FaDownload className="text-lg" />
            </a>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className={iconButton}
              aria-label="Close CV"
              title="Close (Esc)">
              <FaTimes className="text-lg" />
            </button>
          </div>
        </div>

        {/* Viewer */}
        <div className="min-h-0 flex-1">
          {failed ? (
            <Fallback />
          ) : (
            <PDFErrorBoundary>
              <PDFViewer file={CV_URL} onError={() => setFailed(true)} />
            </PDFErrorBoundary>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
