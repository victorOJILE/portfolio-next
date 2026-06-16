import { useState, useEffect, RefObject } from 'react';

export function useScrollVisibility(ref: RefObject<HTMLElement>): boolean {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      function([entry]) {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      }, { threshold: 0.1, rootMargin: '50px' }
    );

    observer.observe(element);

    return () => { observer.disconnect(); };
  }, [ref]);

  return isVisible;
}
