import { useEffect, useRef } from 'react';

/**
 * Starts downloading images before anything shows them, so they are already in the browser cache
 * when they are needed. Requests go out once, the first time `start` is true.
 */
export function usePreloadImages(sources: string[], start: boolean) {
  const started = useRef(false);

  useEffect(() => {
    if (!start || started.current) return;
    started.current = true;
    sources.forEach((source) => {
      const image = new window.Image();
      image.src = source;
    });
  }, [sources, start]);
}
