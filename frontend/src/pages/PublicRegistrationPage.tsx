import { FormEvent, useState } from 'react';
import { HealthDetailsStep } from '@/features/public-registration/components/HealthDetailsStep';
import { PersonalDetailsStep } from '@/features/public-registration/components/PersonalDetailsStep';
import { RegistrationActions } from '@/features/public-registration/components/RegistrationActions';
import { RegistrationProgress } from '@/features/public-registration/components/RegistrationProgress';
import { RegistrationReviewStep } from '@/features/public-registration/components/RegistrationReviewStep';
import {
  RegistrationMobileIntro,
  RegistrationShell,
} from '@/features/public-registration/components/RegistrationShell';
import { RegistrationStepHeading } from '@/features/public-registration/components/RegistrationStepHeading';
import { RegistrationSuccess } from '@/features/public-registration/components/RegistrationSuccess';
import { usePublicRegistration } from '@/features/public-registration/hooks/usePublicRegistration';
import { RegistrationStep } from '@/features/public-registration/types';

const stepTitles = ['Datos personales', 'Tu salud', 'Revisa tus datos'];

export function PublicRegistrationPage() {
  const [step, setStep] = useState<RegistrationStep>(1);
  const {
    form,
    error,
    sent,
    update,
    addListItem,
    removeListItem,
    toggleDisease,
    submit,
    clearError,
    setError,
  } = usePublicRegistration();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearError();

    if (step === 3) {
      await submit();
      return;
    }

    if (!event.currentTarget.checkValidity()) {
      event.currentTarget.reportValidity();
      return;
    }

    if (step === 1 && !form.deliveryZone) {
      setError('Selecciona una zona para continuar.');
      return;
    }

    setStep(step === 1 ? 2 : 3);
  };

  const previous = () => {
    clearError();
    setStep(step === 3 ? 2 : 1);
  };

  const title = stepTitles[step - 1];

  return (
    <RegistrationShell>
      {sent ? (
        <RegistrationSuccess />
      ) : (
        <div className="mx-auto flex w-full max-w-[500px] flex-1 flex-col px-6 pb-7 pt-7 sm:px-8 md:max-w-[442px] md:px-0 md:pt-7">
          <RegistrationMobileIntro />
          <div className="mt-7 md:mt-0">
            <RegistrationProgress step={step} />
          </div>
          <form onSubmit={handleSubmit} className="mt-8 flex flex-1 flex-col">
            <div>
              <RegistrationStepHeading title={title} />
              {step === 1 && <PersonalDetailsStep form={form} update={update} />}
              {step === 2 && (
                <HealthDetailsStep
                  form={form}
                  update={update}
                  addListItem={addListItem}
                  removeListItem={removeListItem}
                  toggleDisease={toggleDisease}
                />
              )}
              {step === 3 && <RegistrationReviewStep form={form} />}
            </div>
            <input
              aria-hidden="true"
              tabIndex={-1}
              className="hidden"
              value={form.website}
              onChange={(event) => update('website', event.target.value)}
            />
            {error && <p className="mt-4 text-[12px] text-alert">{error}</p>}
            <RegistrationActions step={step} onPrevious={previous} />
          </form>
        </div>
      )}
    </RegistrationShell>
  );
}
