import { useState, useEffect, RefObject } from 'react';

type VisibilityCallback = (visible: boolean) => void;

const callbacks = new Map < Element,
 VisibilityCallback > ();

const observer =
 typeof IntersectionObserver !== 'undefined' ?
 new IntersectionObserver(
  (entries) => {
   for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    
    const callback = callbacks.get(entry.target);
    if (callback) {
     callback(true);
     callbacks.delete(entry.target);
    }
    
    observer.unobserve(entry.target);
   }
  }, { threshold: 0.1, rootMargin: '50px' }
 ) :
 null;

function observe(element: Element, callback: VisibilityCallback) {
 callbacks.set(element, callback);
 observer!.observe(element);
}

function unobserve(element: Element) {
 callbacks.delete(element);
 observer?.unobserve(element);
}

export function useScrollVisibility(ref: RefObject < HTMLElement > ): boolean {
 const [isVisible, setIsVisible] = useState(false);
 
 useEffect(() => {
  const element = ref.current;
  if (!element) return;
  
  if (!observer) {
   setIsVisible(true);
   return;
  }
  
  observe(element, setIsVisible);
  
  return () => unobserve(element);
 }, [ref]);
 
 return isVisible;
}