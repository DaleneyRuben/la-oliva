import { RegistrationStep } from '@/features/public-registration/types';

interface RegistrationActionsProps {
  step: RegistrationStep;
  onPrevious: () => void;
}

export function RegistrationActions({ step, onPrevious }: RegistrationActionsProps) {
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
      <button
        type="submit"
        className="rounded-[9px] bg-brand-primary px-5 py-3 text-[12px] font-semibold text-brand-on-primary shadow-card-elevated transition hover:bg-brand-primary-hover"
      >
        {step === 3 ? 'Enviar solicitud' : 'Continuar'}
      </button>
    </div>
  );
}
