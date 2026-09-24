import { useCallback, useRef, useState } from 'react';

// Guards a write triggered from the UI against running twice. The ref blocks a second call at once,
// before React re-renders the button as disabled — a double click fires both clicks in that gap,
// and a mutation's isPending flips later still, on TanStack Query's own schedule. The state only
// drives the loading spinner.
export function usePendingAction() {
  const inFlight = useRef(false);
  const [pending, setPending] = useState(false);

  const run = useCallback(async <T>(action: () => Promise<T>): Promise<T | undefined> => {
    if (inFlight.current) return undefined;

    inFlight.current = true;
    setPending(true);
    try {
      return await action();
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  }, []);

  return { pending, run };
}
