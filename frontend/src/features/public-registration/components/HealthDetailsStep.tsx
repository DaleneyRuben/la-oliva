import { FieldError } from '@ui/FieldError';
import { DISEASES } from '@/features/clients/constants/diseases';
import { ListEditor } from '@/features/public-registration/components/ListEditor';
import {
  ListField,
  RegistrationForm,
  UpdateRegistrationForm,
} from '@/features/public-registration/types';
import { publicRegistrationFieldClass } from '@/features/public-registration/utils';
import { RegistrationErrors } from '@/features/public-registration/validation';

interface HealthDetailsStepProps {
  form: RegistrationForm;
  update: UpdateRegistrationForm;
  addListItem: (key: ListField, value: string) => void;
  removeListItem: (key: ListField, item: string) => void;
  toggleDisease: (disease: string) => void;
  errors?: RegistrationErrors;
}

export function HealthDetailsStep({
  form,
  update,
  addListItem,
  removeListItem,
  toggleDisease,
  errors = {},
}: HealthDetailsStepProps) {
  return (
    <div className="mt-7 space-y-5">
      <p className="text-[12px] leading-[1.45] text-muted">
        Si no tiene el dato exacto puede poner un aproximado
      </p>
      <div className="grid grid-cols-2 gap-4">
        <label htmlFor="weight" className="text-[11px] font-semibold text-ink-2">
          Peso (kg) <span className="text-required">*</span>
          <input
            id="weight"
            type="number"
            min="0.1"
            step="0.1"
            required
            value={form.weight}
            onChange={(event) => update('weight', event.target.value)}
            aria-invalid={!!errors.weight || undefined}
            placeholder="Ej. 65,5"
            className={`${publicRegistrationFieldClass(!!errors.weight)} mt-2`}
          />
          {errors.weight && <FieldError>{errors.weight}</FieldError>}
        </label>
        <label htmlFor="height" className="text-[11px] font-semibold text-ink-2">
          Talla (cm) <span className="text-required">*</span>
          <input
            id="height"
            type="number"
            min="1"
            required
            value={form.height}
            onChange={(event) => update('height', event.target.value)}
            aria-invalid={!!errors.height || undefined}
            placeholder="Ej. 165"
            className={`${publicRegistrationFieldClass(!!errors.height)} mt-2`}
          />
          {errors.height && <FieldError>{errors.height}</FieldError>}
        </label>
      </div>
      <ListEditor
        label="Alergias, intolerancias y gustos"
        items={form.restrictions}
        onAdd={(value) => addListItem('restrictions', value)}
        onRemove={(value) => removeListItem('restrictions', value)}
      />
      <div>
        <p className="mb-2 text-[12px] font-semibold text-ink-2">Enfermedades de base</p>
        <div className="flex flex-wrap gap-2">
          {DISEASES.map((disease) => (
            <button
              key={disease}
              type="button"
              aria-pressed={form.underlyingDiseases.includes(disease)}
              onClick={() => toggleDisease(disease)}
              className={`rounded-full border px-3 py-2 text-[11px] font-semibold ${
                form.underlyingDiseases.includes(disease)
                  ? 'border-brand-primary bg-cream-2 text-ink'
                  : 'border-rule bg-paper text-muted hover:border-brand-primary'
              }`}
            >
              {disease === 'Otro' ? 'Otro +' : disease}
            </button>
          ))}
        </div>
        {form.underlyingDiseases.includes('Otro') && (
          <label
            htmlFor="otherUnderlyingDisease"
            className="mt-3 block text-[11px] font-semibold text-ink-2"
          >
            Especificar enfermedad <span className="text-required">*</span>
            <input
              id="otherUnderlyingDisease"
              required
              value={form.otherUnderlyingDisease}
              onChange={(event) => update('otherUnderlyingDisease', event.target.value)}
              aria-invalid={!!errors.otherUnderlyingDisease || undefined}
              className={`${publicRegistrationFieldClass(!!errors.otherUnderlyingDisease)} mt-2`}
            />
            {errors.otherUnderlyingDisease && (
              <FieldError>{errors.otherUnderlyingDisease}</FieldError>
            )}
          </label>
        )}
      </div>
      <ListEditor
        label="Operaciones"
        items={form.operations}
        onAdd={(value) => addListItem('operations', value)}
        onRemove={(value) => removeListItem('operations', value)}
      />
      <ListEditor
        label="Medicamentos"
        items={form.medications}
        onAdd={(value) => addListItem('medications', value)}
        onRemove={(value) => removeListItem('medications', value)}
      />
    </div>
  );
}
