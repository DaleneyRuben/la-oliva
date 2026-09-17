import { RegistrationStep } from '@/features/public-registration/types';

const stepLabels = ['Datos', 'Salud', 'Enviar'];

export function RegistrationProgress({ step }: { step: RegistrationStep }) {
  return (
    <ol
      aria-label="Progreso de solicitud"
      className="mx-auto flex max-w-[330px] items-start justify-between"
    >
      {stepLabels.map((label, index) => {
        const number = index + 1;
        const completed = number <= step;
        const current = number === step;

        return (
          <li
            key={label}
            aria-current={current ? 'step' : undefined}
            className="flex w-16 flex-col items-center gap-2 text-center"
          >
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full border text-[11px] ${
                completed
                  ? 'border-brand-primary bg-brand-primary text-brand-on-primary'
                  : 'border-rule bg-paper text-faint'
              }`}
            >
              {number}
            </span>
            <span
              className={`text-[9px] font-medium uppercase tracking-[0.08em] ${
                completed ? 'text-ink' : 'text-faint'
              }`}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
