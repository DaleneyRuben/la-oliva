import { FormEvent, useState } from 'react';
import { FormErrorSummary } from '@ui/FormErrorSummary';
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
import { validateRegistrationStep } from '@/features/public-registration/validation';

const stepTitles = ['Datos personales', 'Tu salud', 'Revisa tus datos'];

export function PublicRegistrationPage() {
  const [step, setStep] = useState<RegistrationStep>(1);
  // Errors stay hidden until the first Continuar on a step, then follow the form live
  const [showErrors, setShowErrors] = useState(false);
  const {
    form,
    error,
    sent,
    submitting,
    update,
    addListItem,
    removeListItem,
    toggleDisease,
    submit,
    clearError,
  } = usePublicRegistration();

  const fieldErrors = showErrors ? validateRegistrationStep(step, form) : {};
  const fieldErrorCount = Object.keys(fieldErrors).length;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearError();

    if (step === 3) {
      await submit();
      return;
    }

    if (Object.keys(validateRegistrationStep(step, form)).length > 0) {
      setShowErrors(true);
      return;
    }

    setShowErrors(false);
    setStep(step === 1 ? 2 : 3);
  };

  const previous = () => {
    clearError();
    setShowErrors(false);
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
          <form noValidate onSubmit={handleSubmit} className="mt-8 flex flex-1 flex-col">
            <div>
              <RegistrationStepHeading title={title} />
              {step === 1 && (
                <PersonalDetailsStep form={form} update={update} errors={fieldErrors} />
              )}
              {step === 2 && (
                <HealthDetailsStep
                  form={form}
                  update={update}
                  addListItem={addListItem}
                  removeListItem={removeListItem}
                  toggleDisease={toggleDisease}
                  errors={fieldErrors}
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
            {fieldErrorCount > 0 && (
              <div className="mt-6">
                <FormErrorSummary count={fieldErrorCount} />
              </div>
            )}
            <RegistrationActions step={step} onPrevious={previous} loading={submitting} />
          </form>
        </div>
      )}
    </RegistrationShell>
  );
}
