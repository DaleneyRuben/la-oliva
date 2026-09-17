import { DISEASES } from '@/features/clients/constants/diseases';
import { ListEditor } from '@/features/public-registration/components/ListEditor';
import {
  ListField,
  RegistrationForm,
  UpdateRegistrationForm,
} from '@/features/public-registration/types';
import { publicRegistrationFieldClass } from '@/features/public-registration/utils';

interface HealthDetailsStepProps {
  form: RegistrationForm;
  update: UpdateRegistrationForm;
  addListItem: (key: ListField, value: string) => void;
  removeListItem: (key: ListField, item: string) => void;
  toggleDisease: (disease: string) => void;
}

export function HealthDetailsStep({
  form,
  update,
  addListItem,
  removeListItem,
  toggleDisease,
}: HealthDetailsStepProps) {
  return (
    <div className="space-y-5">
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
            placeholder="Ej. 65,5"
            className={`${publicRegistrationFieldClass} mt-2`}
          />
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
            placeholder="Ej. 165"
            className={`${publicRegistrationFieldClass} mt-2`}
          />
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
              className={`${publicRegistrationFieldClass} mt-2`}
            />
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
