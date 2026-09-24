import { useState } from 'react';
import { Icon } from '@ui/Icon';
import { Modal } from '@ui/Modal';
import { Button } from '@ui/Button';
import { MODAL_CANCEL_STYLE, CONFIRM_DIALOG_STYLE } from '@ui/modalButtonStyles';
import { usePendingAction } from '@/hooks/usePendingAction';

interface Props {
  title: string;
  message: React.ReactNode;
  details?: React.ReactNode;
  confirmLabel: string;
  icon?: string;
  variant?: 'destructive' | 'primary';
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

const BADGE_CLASSES = {
  destructive: 'bg-danger-bg text-danger',
  primary: 'bg-ok-bg text-ok',
};

export function ConfirmModal({
  title,
  message,
  details,
  confirmLabel,
  icon,
  variant = 'destructive',
  onClose,
  onConfirm,
}: Props) {
  const { pending: isLoading, run } = usePendingAction();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleConfirm = () =>
    run(async () => {
      setErrorMessage(null);
      try {
        await onConfirm();
        onClose();
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'No se pudo completar la acción.');
      }
    });

  return (
    <Modal onClose={onClose} className="w-[min(420px,92vw)]">
      <div className="px-[28px] py-[26px]">
        {icon ? (
          <div className="flex items-center gap-3 mb-3.5">
            <span
              data-testid="confirm-modal-icon-badge"
              className={`w-10 h-10 rounded-[11px] ${BADGE_CLASSES[variant]} flex items-center justify-center shrink-0`}
            >
              <Icon name={icon} size={20} stroke={1.9} />
            </span>
            <p className="font-serif font-semibold text-[24px] leading-[1.05] text-ink">{title}</p>
          </div>
        ) : (
          <p className="font-serif font-semibold text-[24px] leading-[1.05] text-ink mb-[10px]">
            {title}
          </p>
        )}
        <p className="text-[13.5px] text-ink-2 leading-[1.55]">{message}</p>
        {details ? <div className="mt-3.5">{details}</div> : null}
        {errorMessage ? (
          <p
            role="alert"
            className="mt-3.5 rounded-[9px] border border-danger/25 bg-danger-bg px-3 py-2.5 text-[12.5px] leading-[1.5] text-danger"
          >
            {errorMessage}
          </p>
        ) : null}
        <div className="flex justify-end gap-2.5 mt-[22px]">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
            style={MODAL_CANCEL_STYLE}
          >
            Cancelar
          </Button>
          <Button
            variant={variant}
            onClick={handleConfirm}
            loading={isLoading}
            style={CONFIRM_DIALOG_STYLE}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
