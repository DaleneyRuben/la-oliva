import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { format, startOfToday } from 'date-fns';
import { Button } from '@ui/Button';
import { StepIndicator } from '@ui/StepIndicator';
import { usePendingAction } from '@/hooks/usePendingAction';
import { useCreateClient } from '@/features/clients/hooks/useCreateClient';
import { useClient } from '@/features/clients/hooks/useClient';
import { useReviewDraft } from '@/features/clients/hooks/useReviewDraft';
import { usePlans } from '@/features/plans/hooks/usePlans';
import { useConvertAppointment } from '@/features/evaluations/hooks/useConvertAppointment';
import { useNutritionistQueue } from '@/features/evaluations/hooks/useNutritionistQueue';
import { StepConfirm } from '@/features/clients/components/wizard/StepConfirm';
import { StepIdentity } from '@/features/clients/components/wizard/StepIdentity';
import { StepPlan } from '@/features/clients/components/wizard/StepPlan';
import { StepRestrictions } from '@/features/clients/components/wizard/StepRestrictions';
import type { NewClientFormValues, RestrictionsState } from '@/features/clients/types';
import { normalizeUnderlyingDiseases } from '@/features/clients/utils/underlyingDiseases';
import { SHIFT_DELIVERY } from '@/features/clients/constants/clientOptions';

const STEPS = ['Identidad', 'Restricciones', 'Plan', 'Confirmar'];

const STEP_FIELDS: Partial<Record<number, (keyof NewClientFormValues)[]>> = {
  1: ['name', 'sex', 'dateOfBirth', 'phoneNumber', 'address', 'deliveryZone', 'delivery'],
  3: ['planId', 'contractDate', 'startDate', 'duration'],
};

export function NewClientPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get('appointmentId');
  const draftId = searchParams.get('draftId');
  const origen: 'Directo' | 'Cita' = appointmentId ? 'Cita' : 'Directo';
  const { create, isCreating } = useCreateClient();
  const { client: draft } = useClient(draftId ?? '');
  const { review, isReviewing } = useReviewDraft(draftId);
  const { convert, isConverting } = useConvertAppointment();
  const { appointments } = useNutritionistQueue({ enabled: origen === 'Cita' });
  const appointment = appointments.find((a) => a.id === appointmentId) ?? null;
  const { plans, isLoading: plansLoading } = usePlans();
  const [step, setStep] = useState(1);
  const [restrictions, setRestrictions] = useState<RestrictionsState>({
    restrictions: [],
    underlyingDiseases: [],
  });
  const [paid, setPaid] = useState<boolean | null>(null);
  const [submitError, setSubmitError] = useState('');
  const { pending: submitting, run } = usePendingAction();

  const {
    register,
    control,
    trigger,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<NewClientFormValues>({
    defaultValues: {
      name: '',
      sex: '',
      dateOfBirth: '',
      phoneNumber: '',
      address: '',
      deliveryZone: '',
      delivery: '',
      deliveryShift: 'day',
      nit: '',
      businessName: '',
      planId: null,
      contractDate: format(startOfToday(), 'yyyy-MM-dd'),
      startDate: '',
      duration: 20,
      price: 0,
      specialInstructions: {},
      weight: null,
      height: null,
      operations: [],
      medications: [],
    },
  });

  const handleNext = async () => {
    const fields = STEP_FIELDS[step];
    if (fields) {
      const valid = await trigger(fields);
      if (!valid) return;
    }
    setStep((s) => s + 1);
  };

  const handleBack = () => setStep((s) => s - 1);

  useEffect(() => {
    if (!appointment) return;
    if (!getValues('name')) setValue('name', appointment.name);
    if (!getValues('phoneNumber')) setValue('phoneNumber', appointment.phone);
  }, [appointment, getValues, setValue]);

  useEffect(() => {
    if (!draft || !draft.isDraft) return;
    setValue('name', draft.name);
    setValue('sex', draft.sex);
    setValue('dateOfBirth', draft.dateOfBirth);
    setValue('phoneNumber', draft.phoneNumber);
    setValue('address', draft.address);
    setValue('deliveryZone', draft.deliveryZone);
    setValue('weight', draft.weight);
    setValue('height', draft.height);
    setValue('operations', draft.operations);
    setValue('medications', draft.medications);
    setValue('startDate', draft.preferredStartDate ?? '');
    setRestrictions({
      restrictions: draft.restrictions,
      ...normalizeUnderlyingDiseases(draft.underlyingDiseases),
    });
  }, [draft, setValue]);

  const submit = handleSubmit(async (data) => {
    setSubmitError('');
    const client = {
      name: data.name,
      sex: data.sex,
      dateOfBirth: data.dateOfBirth,
      phoneNumber: data.phoneNumber,
      address: data.address,
      deliveryZone: data.deliveryZone,
      delivery: data.delivery,
      deliveryShift: data.delivery === SHIFT_DELIVERY ? data.deliveryShift : null,
      ...(data.nit ? { nit: data.nit } : {}),
      ...(data.businessName ? { businessName: data.businessName } : {}),
      underlyingDiseases: restrictions.underlyingDiseases.map((disease) =>
        disease === 'Otro' ? restrictions.otherUnderlyingDisease!.trim() : disease,
      ),
      restrictions: restrictions.restrictions,
      weight: data.weight!,
      height: data.height!,
      operations: data.operations,
      medications: data.medications,
    };
    const subscription = {
      planId: data.planId!,
      contractDate: data.contractDate,
      startDate: data.startDate,
      duration: data.duration,
      price: data.price,
      ...(Object.keys(data.specialInstructions).length > 0
        ? { specialInstructions: data.specialInstructions }
        : {}),
    };
    try {
      if (draftId) {
        await review(client, subscription);
        navigate('/clientes');
      } else if (origen === 'Cita' && appointmentId) {
        await convert(appointmentId, client, { ...subscription, paid: paid! });
        navigate('/evaluaciones');
      } else {
        await create(client, subscription);
        navigate('/clientes');
      }
    } catch {
      setSubmitError('Error al guardar el cliente. Intenta de nuevo.');
    }
  });

  const backTarget = origen === 'Cita' ? '/evaluaciones' : '/clientes';

  return (
    <div>
      <div className="px-4 py-5 lg:px-[44px] lg:pt-[30px] lg:pb-[20px] border-b border-hairline">
        <div className="flex items-center gap-2 font-mono text-[11px] tracking-[.1em] text-faint uppercase mb-3">
          <Button
            variant="bare"
            onClick={() => navigate(backTarget)}
            className="text-olive-600 hover:underline"
            style={{ padding: 0, fontSize: 'inherit' }}
          >
            Clientes
          </Button>
          <span className="opacity-50">/</span>
          <span>Directorio</span>
        </div>
        <h1 className="font-serif font-semibold text-[28px] lg:text-[38px] leading-none tracking-[.005em] text-ink">
          {draftId ? 'Revisar solicitud' : 'Agregar cliente'}
        </h1>
      </div>

      <div className="px-4 py-5 lg:px-[44px] lg:pt-[26px]">
        <div className="max-w-[680px] mx-auto">
          <StepIndicator steps={STEPS} current={step} />
        </div>
      </div>

      <div className="px-4 lg:px-[44px]">
        <div className="max-w-[860px] w-full mx-auto lg:pt-[30px]">
          {step === 1 && <StepIdentity register={register} control={control} errors={errors} />}
          {step === 2 && (
            <StepRestrictions
              value={restrictions}
              onChange={(u) => setRestrictions((prev) => ({ ...prev, ...u }))}
              register={register}
              errors={errors}
            />
          )}
          {step === 3 && (
            <StepPlan
              register={register}
              control={control}
              errors={errors}
              plans={plans}
              setValue={setValue}
              isLoading={plansLoading}
              origen={origen}
            />
          )}
          {step === 4 && (
            <StepConfirm
              formValues={getValues()}
              restrictions={restrictions}
              plans={plans}
              submitError={submitError}
              origen={origen}
              paid={paid}
              onPaidChange={setPaid}
            />
          )}
        </div>
      </div>

      <div className="px-4 lg:px-[44px]">
        <div className="max-w-[860px] w-full mx-auto flex items-center justify-between gap-4 py-6 lg:py-[24px]">
          {step > 1 ? (
            <Button variant="secondary" onClick={handleBack} leftIcon="arrow-left">
              Atrás
            </Button>
          ) : (
            <Button variant="secondary" onClick={() => navigate(backTarget)} leftIcon="arrow-left">
              Cancelar
            </Button>
          )}
          <div className="flex items-center gap-[14px]">
            <span className="font-mono text-[11px] tracking-[.06em] text-faint uppercase">
              Paso {step} de 4
            </span>
            {step < 4 ? (
              <Button onClick={handleNext} rightIcon="arrow-right">
                Siguiente
              </Button>
            ) : (
              <Button
                onClick={() => run(submit)}
                loading={submitting || isCreating || isConverting || isReviewing}
                disabled={origen === 'Cita' && paid === null}
                rightIcon="check"
              >
                {draftId ? 'Confirmar cliente' : 'Crear cliente'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
