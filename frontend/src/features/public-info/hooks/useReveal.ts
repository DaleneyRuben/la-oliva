import { useEffect, useRef, useState, type RefObject } from 'react';

interface Options {
  /** Children fade in one after another instead of the element as a whole. */
  stagger?: boolean;
}

interface Reveal<T extends HTMLElement> {
  ref: RefObject<T>;
  className: string;
}

// The share of the element that must be on screen before it reveals. Low enough that tall
// sections start moving as soon as their top edge is well inside the viewport.
const VISIBLE_THRESHOLD = 0.15;

function hasScrolledPast(entry: IntersectionObserverEntry) {
  return entry.boundingClientRect.bottom < 0;
}

function supportsIntersectionObserver() {
  return typeof window !== 'undefined' && typeof window.IntersectionObserver === 'function';
}

/**
 * Reveals an element the first time it scrolls into view. The returned `className` pairs with
 * the `.reveal` / `.reveal-stagger` rules in base.css, which only animate when the visitor has
 * not asked for reduced motion. Browsers without IntersectionObserver show the element at once.
 */
export function useReveal<T extends HTMLElement>({ stagger = false }: Options = {}): Reveal<T> {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(() => !supportsIntersectionObserver());

  useEffect(() => {
    const element = ref.current;
    if (!element || !supportsIntersectionObserver()) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        // An element already above the viewport (a mid-page reload, an anchor jump) would never
        // intersect, so it counts as revealed instead of staying invisible until scrolled back to.
        if (entries.some((entry) => entry.isIntersecting || hasScrolledPast(entry))) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: VISIBLE_THRESHOLD },
    );
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const base = stagger ? 'reveal-stagger' : 'reveal';

  return { ref, className: visible ? `${base} is-visible` : base };
}
