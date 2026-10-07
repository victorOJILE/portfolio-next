'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { AnimatePresence } from 'framer-motion';
import { trackViewCV } from '@/lib/firebase/analytics';

// The modal (and, inside it, react-pdf) is only downloaded the first time the CV is opened.
const CVModal = dynamic(() => import('@/components/common/CVModal'), {
  ssr: false,
  loading: () => (
    <div
      className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center"
      role="status">
      <span className="rounded-full border border-gray-700 bg-dark-300 px-4 py-2 text-gray-200 shadow-lg">
        Loading CV…
      </span>
    </div>
  ),
});

const NAV_OPTIONS = { shallow: true, scroll: false } as const;

// Current URL with `?cv=open` added or removed (other params and the #hash are kept).
function buildUrl(open: boolean) {
  const url = new URL(window.location.href);
  if (open) url.searchParams.set('cv', 'open');
  else url.searchParams.delete('cv');
  return url.pathname + url.search + url.hash;
}

interface CVModalContextType {
  openCV: (source: string) => void;
}

const CVModalContext = createContext<CVModalContextType | undefined>(undefined);

export default function CVModalProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const routerRef = useRef(router);
  routerRef.current = router;

  const [isOpen, setIsOpenState] = useState(false);
  const isOpenRef = useRef(false);
  // True when the current `?cv=open` URL is its own history entry that we can pop with Back.
  const entryPushedRef = useRef(false);
  const deepLinkHandled = useRef(false);

  const setOpen = useCallback((open: boolean) => {
    isOpenRef.current = open;
    setIsOpenState(open);
  }, []);

  const openCV = useCallback(
    (source: string) => {
      if (isOpenRef.current) return;
      trackViewCV(source);
      setOpen(true);
      // Own history entry, so the browser/phone Back button closes the modal.
      entryPushedRef.current = true;
      routerRef.current.push(buildUrl(true), undefined, NAV_OPTIONS);
    },
    [setOpen]
  );

  const closeCV = useCallback(() => {
    if (!isOpenRef.current) return;
    setOpen(false);
    if (entryPushedRef.current) {
      // Pop the entry we pushed, keeping history clean.
      entryPushedRef.current = false;
      routerRef.current.back();
    } else {
      routerRef.current.replace(buildUrl(false), undefined, NAV_OPTIONS);
    }
  }, [setOpen]);

  // Browser Back/Forward: the URL decides whether the modal is open.
  // (popstate only fires on history traversal, never on our own push/replace.)
  useEffect(() => {
    const onPopState = () => {
      const open = new URLSearchParams(window.location.search).get('cv') === 'open';
      entryPushedRef.current = open;
      setOpen(open);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [setOpen]);

  // Deep link: open the modal on first load when the URL has ?cv=open.
  useEffect(() => {
    if (!router.isReady || deepLinkHandled.current) return;
    deepLinkHandled.current = true;
    if (router.query.cv !== 'open') return;

    trackViewCV('url');
    setOpen(true);

    const navigation = performance.getEntriesByType('navigation')[0] as
      | PerformanceNavigationTiming
      | undefined;
    if (navigation?.type === 'reload') {
      // Reloading an entry we pushed: the previous entry is already the plain page.
      entryPushedRef.current = true;
      return;
    }

    // Fresh link: turn this entry into the plain page, then push the modal entry on top,
    // so Back closes the modal instead of leaving the site.
    const r = routerRef.current;
    r.replace(buildUrl(false), undefined, NAV_OPTIONS)
      .then(() => {
        if (!isOpenRef.current) return;
        entryPushedRef.current = true;
        return r.push(buildUrl(true), undefined, NAV_OPTIONS);
      })
      .catch(() => {});
  }, [router.isReady, router.query.cv, setOpen]);

  return (
    <CVModalContext.Provider value={{ openCV }}>
      {children}
      <AnimatePresence>
        {isOpen && <CVModal key="cv-modal" onClose={closeCV} />}
      </AnimatePresence>
    </CVModalContext.Provider>
  );
}

export function useCVModal() {
  const context = useContext(CVModalContext);
  if (!context) {
    throw new Error('useCVModal must be used within CVModalProvider');
  }
  return context;
}
