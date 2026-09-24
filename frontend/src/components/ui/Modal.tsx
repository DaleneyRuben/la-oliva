import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { ReactNode } from 'react';

interface Props {
  onClose: () => void;
  children: ReactNode;
  className?: string;
  // A write is in flight: Escape and the backdrop stop closing the modal, so the request can't
  // finish behind it and reopening can't start a second one from an idle form.
  busy?: boolean;
}

export function Modal({ onClose, children, className = '', busy = false }: Props) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !busy) onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose, busy]);

  // Portal escapes any ancestor `transform` (e.g. page-enter animation) that would
  // otherwise make `fixed` children position relative to that element, not the viewport.
  return createPortal(
    <>
      <div
        data-testid="modal-backdrop"
        className="fixed inset-0 z-50 bg-modal-backdrop backdrop-blur-[3px] modal-backdrop-enter"
        onClick={busy ? undefined : onClose}
        aria-hidden="true"
      />
      <div className="fixed inset-0 z-60 flex items-center justify-center p-4 pointer-events-none">
        <div
          role="dialog"
          aria-modal="true"
          className={`pointer-events-auto bg-cream rounded-[16px] shadow-[var(--shadow-dialog)] modal-dialog-enter ${className}`}
        >
          {children}
        </div>
      </div>
    </>,
    document.body,
  );
}
