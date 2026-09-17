import { useState } from 'react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { TagInput } from '@ui/TagInput';
import { TogglePill } from '@ui/TogglePill';
import { Field, inputCls } from '@ui/Field';
import { WizardSectionCard } from '@ui/WizardSectionCard';
import { DISEASES } from '@/features/clients/constants/diseases';
import type { NewClientFormValues, RestrictionsState } from '@/features/clients/types';

interface Props {
  value: RestrictionsState;
  onChange: (updates: Partial<RestrictionsState>) => void;
  register?: UseFormRegister<NewClientFormValues>;
  errors?: FieldErrors<NewClientFormValues>;
}

export function StepRestrictions({ value, onChange, register, errors }: Props) {
  const [draft, setDraft] = useState('');

  const add = () => {
    const v = draft.trim();
    if (!v || value.restrictions.includes(v)) return;
    onChange({ restrictions: [...value.restrictions, v] });
    setDraft('');
  };

  const remove = (v: string) => {
    const idx = value.restrictions.indexOf(v);
    onChange({ restrictions: value.restrictions.filter((_, k) => k !== idx) });
  };

  const toggleDisease = (d: string) => {
    const selected = value.underlyingDiseases.includes(d);
    onChange({
      underlyingDiseases: selected
        ? value.underlyingDiseases.filter((x) => x !== d)
        : [...value.underlyingDiseases, d],
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <WizardSectionCard
        icon="alert"
        iconBg="bg-warn-bg"
        iconColor="text-warn"
        title="Alergias, intolerancias y gustos"
        description="Agrega lo que el cliente no puede o no quiere consumir. Se resaltará en la cocina."
        descriptionMb={18}
      >
        <TagInput
          placeholder="Ej. lácteos, maní, cebolla…"
          emptyMessage="Sin elementos agregados."
          tags={value.restrictions}
          input={draft}
          setInput={setDraft}
          onAdd={add}
          onRemove={remove}
          tagClassName="bg-warn-bg border-warn-border text-warn"
        />
      </WizardSectionCard>

      <WizardSectionCard
        icon="stethoscope"
        iconBg="bg-cream-2"
        iconColor="text-muted"
        title="Información de salud"
        description="El peso y la talla son necesarios para preparar el plan."
        descriptionMb={18}
      >
        {register && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-[22px] gap-y-[18px]">
            <Field label="Peso (kg)" htmlFor="weight" required error={errors?.weight?.message}>
              <input
                id="weight"
                type="number"
                min="1"
                step="0.1"
                {...register('weight', { required: 'Peso es requerido', valueAsNumber: true })}
                className={inputCls(!!errors?.weight)}
              />
            </Field>
            <Field label="Talla (cm)" htmlFor="height" required error={errors?.height?.message}>
              <input
                id="height"
                type="number"
                min="1"
                step="0.1"
                {...register('height', { required: 'Talla es requerida', valueAsNumber: true })}
                className={inputCls(!!errors?.height)}
              />
            </Field>
            <Field label="Operaciones" htmlFor="operations">
              <input
                id="operations"
                placeholder="Separar con comas"
                {...register('operations', {
                  setValueAs: (inputValue: string | string[]) =>
                    (typeof inputValue === 'string' ? inputValue : inputValue.join(','))
                      .split(',')
                      .map((item) => item.trim())
                      .filter(Boolean),
                })}
                className={inputCls()}
              />
            </Field>
            <Field label="Medicamentos" htmlFor="medications">
              <input
                id="medications"
                placeholder="Separar con comas"
                {...register('medications', {
                  setValueAs: (inputValue: string | string[]) =>
                    (typeof inputValue === 'string' ? inputValue : inputValue.join(','))
                      .split(',')
                      .map((item) => item.trim())
                      .filter(Boolean),
                })}
                className={inputCls()}
              />
            </Field>
          </div>
        )}
      </WizardSectionCard>

      <WizardSectionCard
        icon="stethoscope"
        iconBg="bg-olive-100"
        iconColor="text-olive-700"
        title="Enfermedades de base"
        description="Selecciona las que apliquen."
        descriptionMb={20}
      >
        <div className="flex flex-wrap gap-[9px]">
          {DISEASES.map((d) => {
            const selected = value.underlyingDiseases.includes(d);
            return (
              <TogglePill
                key={d}
                pressed={selected}
                onClick={() => toggleDisease(d)}
                className="py-[7px] px-[15px] text-[13px]"
              >
                {d}
              </TogglePill>
            );
          })}
        </div>
        {value.underlyingDiseases.includes('Otro') && (
          <div className="mt-4 max-w-md">
            <Field label="Especificar enfermedad" htmlFor="otherUnderlyingDisease" required>
              <input
                id="otherUnderlyingDisease"
                required
                value={value.otherUnderlyingDisease ?? ''}
                onChange={(event) => onChange({ otherUnderlyingDisease: event.target.value })}
                className={inputCls()}
              />
            </Field>
          </div>
        )}
      </WizardSectionCard>
    </div>
  );
}
