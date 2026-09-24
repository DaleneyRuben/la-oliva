import { Button } from '@ui/Button';
import { RegistrationStep } from '@/features/public-registration/types';

// Inline so the design's size wins over Button's default size classes deterministically.
const SUBMIT_STYLE = { padding: '10.5px 17.5px', fontSize: '12px', lineHeight: 1.45 };

interface RegistrationActionsProps {
  step: RegistrationStep;
  onPrevious: () => void;
  loading?: boolean;
}

export function RegistrationActions({
  step,
  onPrevious,
  loading = false,
}: RegistrationActionsProps) {
  return (
    <div className="mt-auto flex items-center justify-between pt-8">
      {step > 1 ? (
        <button
          type="button"
          onClick={onPrevious}
          className="px-4 py-3 text-[12px] font-semibold text-brand-primary hover:text-brand-primary-hover"
        >
          Anterior
        </button>
      ) : (
        <span />
      )}
      <span className="text-[11px] text-faint">Paso {step} de 3</span>
      <Button
        type="submit"
        variant="bare"
        loading={loading}
        style={SUBMIT_STYLE}
        className="bg-brand-primary font-semibold text-brand-on-primary shadow-card-elevated hover:bg-brand-primary-hover"
      >
        {step === 3 ? 'Enviar solicitud' : 'Continuar'}
      </Button>
    </div>
  );
}
