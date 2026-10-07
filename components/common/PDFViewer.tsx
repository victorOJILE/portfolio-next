'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import {
  FaChevronLeft,
  FaChevronRight,
  FaSearchMinus,
  FaSearchPlus,
} from 'react-icons/fa';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

const MIN_SCALE = 0.5;
const MAX_SCALE = 2.5;
const SCALE_STEP = 0.25;
const CONTAINER_PADDING = 16; // matches `p-4` on the scroll container

const clampScale = (s: number) =>
  Math.min(MAX_SCALE, Math.max(MIN_SCALE, Math.round(s * 100) / 100));

interface PDFViewerProps {
  file: string;
  onError: () => void;
}

const toolbarButton =
  'flex h-9 w-9 items-center justify-center rounded text-gray-300 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-300';

export default function PDFViewer({ file, onError }: PDFViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [baseWidth, setBaseWidth] = useState<number>();
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1);

  // Mirrors of state for use inside long-lived event listeners.
  const scaleRef = useRef(scale);
  scaleRef.current = scale;
  const currentPageRef = useRef(currentPage);
  currentPageRef.current = currentPage;
  const numPagesRef = useRef(numPages);
  numPagesRef.current = numPages;
  // Scroll offset to apply after a zoom so the focal point stays put.
  const pendingScroll = useRef<{ dx: number; dy: number } | null>(null);

  // Fit pages to the container width (also fixes mobile, where iframes only show page 1).
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () =>
      setBaseWidth(Math.min(el.clientWidth - CONTAINER_PADDING * 2, 900));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Page indicator: the last page whose top has passed the middle of the viewport.
  const updateCurrentPage = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const atBottom =
      el.scrollTop > 0 && el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
    let page = 1;
    if (atBottom) {
      page = numPagesRef.current || 1;
    } else {
      const middle = el.scrollTop + el.clientHeight / 2;
      pageRefs.current.forEach((node, i) => {
        if (node && node.offsetTop <= middle) page = i + 1;
      });
    }
    setCurrentPage(page);
  }, []);

  useEffect(() => {
    updateCurrentPage();
  }, [scale, numPages, updateCurrentPage]);

  // Zoom around a focal point (in the content's own coordinates) so it doesn't jump.
  const commitScale = useCallback((next: number, ox: number, oy: number) => {
    const prev = scaleRef.current;
    const clamped = clampScale(next);
    if (clamped === prev) return;
    const ratio = clamped / prev;
    pendingScroll.current = { dx: ox * (ratio - 1), dy: oy * (ratio - 1) };
    scaleRef.current = clamped;
    setScale(clamped);
  }, []);

  useLayoutEffect(() => {
    const el = containerRef.current;
    const pending = pendingScroll.current;
    pendingScroll.current = null;
    if (el && pending) {
      el.scrollLeft += pending.dx;
      el.scrollTop += pending.dy;
    }
  }, [scale]);

  // Button / keyboard zoom focuses on the centre of the visible area.
  const zoomTo = useCallback(
    (target: number) => {
      const el = containerRef.current;
      const content = contentRef.current;
      let ox = 0;
      let oy = 0;
      if (el && content) {
        const c = el.getBoundingClientRect();
        const r = content.getBoundingClientRect();
        ox = c.left + c.width / 2 - r.left;
        oy = c.top + c.height / 2 - r.top;
      }
      commitScale(target, ox, oy);
    },
    [commitScale]
  );

  const goToPage = useCallback((page: number) => {
    const el = containerRef.current;
    const node = pageRefs.current[page - 1];
    if (!el || !node) return;
    currentPageRef.current = page;
    setCurrentPage(page);
    el.scrollTo({ top: node.offsetTop - CONTAINER_PADDING });
  }, []);

  // Keyboard shortcuts: + / - / 0 for zoom, ← / → for pages.
  // Up/Down and PageUp/PageDown are left alone so normal scrolling still works.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return; // keep browser zoom shortcuts
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      switch (e.key) {
        case '+':
        case '=':
          e.preventDefault();
          zoomTo(scaleRef.current + SCALE_STEP);
          break;
        case '-':
        case '_':
          e.preventDefault();
          zoomTo(scaleRef.current - SCALE_STEP);
          break;
        case '0':
          e.preventDefault();
          zoomTo(1);
          break;
        case 'ArrowLeft':
        case 'ArrowRight': {
          const el = containerRef.current;
          // When zoomed in sideways, arrows keep scrolling horizontally.
          if (el && el.scrollWidth > el.clientWidth + 1) return;
          e.preventDefault();
          const next = currentPageRef.current + (e.key === 'ArrowRight' ? 1 : -1);
          if (next >= 1 && next <= numPagesRef.current) goToPage(next);
          break;
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [zoomTo, goToPage]);

  // Pinch-to-zoom. While pinching we only scale the wrapper with a CSS transform
  // (cheap, no PDF re-render); on release we commit the new scale so pages re-render crisp.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let pinch: {
      startDist: number;
      startScale: number;
      ox: number;
      oy: number;
      factor: number;
    } | null = null;

    const distance = (t: TouchList) =>
      Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);

    const onTouchStart = (e: TouchEvent) => {
      const content = contentRef.current;
      if (e.touches.length !== 2 || !content) return;
      const rect = content.getBoundingClientRect();
      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      pinch = {
        startDist: distance(e.touches),
        startScale: scaleRef.current,
        ox: midX - rect.left,
        oy: midY - rect.top,
        factor: 1,
      };
      content.style.transformOrigin = `${pinch.ox}px ${pinch.oy}px`;
    };

    const onTouchMove = (e: TouchEvent) => {
      const content = contentRef.current;
      if (!pinch || !content || e.touches.length !== 2) return;
      e.preventDefault();
      const raw = distance(e.touches) / pinch.startDist;
      pinch.factor = Math.min(
        MAX_SCALE / pinch.startScale,
        Math.max(MIN_SCALE / pinch.startScale, raw)
      );
      content.style.transform = `scale(${pinch.factor})`;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!pinch || e.touches.length >= 2) return;
      const { factor, startScale, ox, oy } = pinch;
      pinch = null;
      const content = contentRef.current;
      if (content) {
        content.style.transform = '';
        content.style.transformOrigin = '';
      }
      if (Math.abs(factor - 1) >= 0.02) commitScale(startScale * factor, ox, oy);
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    el.addEventListener('touchcancel', onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [commitScale]);

  return (
    <div className="flex h-full flex-col">
      <div
        ref={containerRef}
        onScroll={updateCurrentPage}
        // touch-pan-*: browser handles panning, we handle pinching. overscroll-contain: no scroll chaining.
        className="relative min-h-0 flex-1 touch-pan-x touch-pan-y overflow-auto overscroll-contain p-4">
        {baseWidth && (
          // w-max + mx-auto: centred when narrower than the viewport, scrollable (not clipped) when zoomed in
          <div ref={contentRef} className="mx-auto w-max">
            <Document
              file={file}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              onLoadError={onError}
              onSourceError={onError}
              loading={<p className="py-20 text-center text-gray-400">Loading CV…</p>}>
              {Array.from({ length: numPages }, (_, i) => (
                <div
                  key={i + 1}
                  ref={(node) => {
                    pageRefs.current[i] = node;
                  }}
                  className="mb-4">
                  <Page
                    pageNumber={i + 1}
                    width={baseWidth * scale}
                    className="shadow-lg"
                  />
                </div>
              ))}
            </Document>
          </div>
        )}
      </div>

      {numPages > 0 && (
        <div className="flex items-center justify-between gap-2 border-t border-gray-700 px-2 py-1 text-sm text-gray-300 sm:px-4">
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className={toolbarButton}
              aria-label="Previous page"
              title="Previous page (←)">
              <FaChevronLeft />
            </button>
            <span
              aria-live="polite"
              className="min-w-[3rem] whitespace-nowrap text-center sm:min-w-[5.5rem]">
              <span className="hidden sm:inline">Page </span>
              {currentPage}
              <span className="sm:hidden"> / </span>
              <span className="hidden sm:inline"> of </span>
              {numPages}
            </span>
            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= numPages}
              className={toolbarButton}
              aria-label="Next page"
              title="Next page (→)">
              <FaChevronRight />
            </button>
          </div>

          <div className="flex items-center">
            <button
              type="button"
              onClick={() => zoomTo(scale - SCALE_STEP)}
              disabled={scale <= MIN_SCALE}
              className={toolbarButton}
              aria-label="Zoom out"
              title="Zoom out (−)">
              <FaSearchMinus />
            </button>
            <button
              type="button"
              onClick={() => zoomTo(1)}
              className="h-9 min-w-[3.25rem] rounded px-2 text-center transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Reset zoom to 100%"
              title="Reset zoom (0)">
              {Math.round(scale * 100)}%
            </button>
            <button
              type="button"
              onClick={() => zoomTo(scale + SCALE_STEP)}
              disabled={scale >= MAX_SCALE}
              className={toolbarButton}
              aria-label="Zoom in"
              title="Zoom in (+)">
              <FaSearchPlus />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
