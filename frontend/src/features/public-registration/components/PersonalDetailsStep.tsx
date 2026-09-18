import { addDays, parseISO, startOfToday } from 'date-fns';
import { DatePickerInput } from '@/components/ui/DatePickerInput';
import { RegistrationForm, UpdateRegistrationForm } from '@/features/public-registration/types';
import { publicRegistrationFieldClass } from '@/features/public-registration/utils';

interface PersonalDetailsStepProps {
  form: RegistrationForm;
  update: UpdateRegistrationForm;
}

export function PersonalDetailsStep({ form, update }: PersonalDetailsStepProps) {
  return (
    <>
      <p className="mt-3 text-[13px] text-muted">
        Completa los campos marcados para comenzar tu solicitud.
      </p>
      <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4">
        <label htmlFor="firstName" className="text-[11px] font-semibold text-ink-2">
          Primer nombre <span className="text-required">*</span>
          <input
            id="firstName"
            required
            value={form.firstName}
            onChange={(event) => update('firstName', event.target.value)}
            placeholder="Ej. María"
            className={`${publicRegistrationFieldClass} mt-2`}
          />
        </label>
        <label htmlFor="lastName" className="text-[11px] font-semibold text-ink-2">
          Primer apellido <span className="text-required">*</span>
          <input
            id="lastName"
            required
            value={form.lastName}
            onChange={(event) => update('lastName', event.target.value)}
            placeholder="Ej. Pérez"
            className={`${publicRegistrationFieldClass} mt-2`}
          />
        </label>
        <label htmlFor="sex" className="text-[11px] font-semibold text-ink-2">
          Sexo <span className="text-required">*</span>
          <select
            id="sex"
            required
            value={form.sex}
            onChange={(event) => update('sex', event.target.value)}
            className={`${publicRegistrationFieldClass} mt-2 pr-9`}
          >
            <option value="">Seleccionar...</option>
            <option value="female">Femenino</option>
            <option value="male">Masculino</option>
          </select>
        </label>
        <div>
          <p className="text-[11px] font-semibold text-ink-2">
            Fecha de nacimiento <span className="text-required">*</span>
          </p>
          <DatePickerInput
            id="dateOfBirth"
            ariaLabel="Fecha de nacimiento"
            required
            value={form.dateOfBirth}
            onChange={(value) => update('dateOfBirth', value)}
            inputClassName={`${publicRegistrationFieldClass} mt-2`}
            captionLayout="dropdown"
            startMonth={parseISO('1940-01-01')}
            endMonth={startOfToday()}
            disabled={{ after: startOfToday() }}
          />
        </div>
        <label htmlFor="phoneNumber" className="flex flex-col text-[11px] font-semibold text-ink-2">
          <span className="min-h-[30px] md:min-h-0">
            Celular <span className="text-required">*</span>
          </span>
          <input
            id="phoneNumber"
            required
            value={form.phoneNumber}
            onChange={(event) => update('phoneNumber', event.target.value)}
            placeholder="7XX XXX XX"
            className={`${publicRegistrationFieldClass} mt-2`}
          />
        </label>
        <div className="flex flex-col">
          <p className="min-h-[30px] text-[11px] font-semibold text-ink-2 md:min-h-0">
            ¿Cuándo quiere iniciar su plan? <span className="text-required">*</span>
          </p>
          <DatePickerInput
            id="preferredStartDate"
            ariaLabel="¿Cuándo quiere iniciar su plan?"
            required
            value={form.preferredStartDate}
            onChange={(value) => update('preferredStartDate', value)}
            inputClassName={`${publicRegistrationFieldClass} mt-2`}
            startMonth={addDays(startOfToday(), 1)}
            disabled={[{ before: addDays(startOfToday(), 1) }, { dayOfWeek: [0, 6] }]}
          />
        </div>
      </div>
      <label htmlFor="address" className="mt-4 block text-[11px] font-semibold text-ink-2">
        Dirección detallada <span className="text-required">*</span>
        <textarea
          id="address"
          rows={2}
          required
          value={form.address}
          onChange={(event) => update('address', event.target.value)}
          placeholder="Calle, número, edificio y referencia"
          className={`${publicRegistrationFieldClass} mt-2 resize-none`}
        />
      </label>
      <fieldset className="mt-4">
        <legend className="text-[11px] font-semibold text-ink-2">
          Zona <span className="text-required">*</span>
        </legend>
        <div className="mt-2 flex gap-2">
          {['Centro', 'Sur'].map((zone) => (
            <button
              key={zone}
              type="button"
              aria-pressed={form.deliveryZone === zone}
              onClick={() => update('deliveryZone', zone)}
              className={`rounded-full border px-3.5 py-2 text-[11px] font-semibold ${
                form.deliveryZone === zone
                  ? 'border-brand-primary bg-cream-2 text-ink'
                  : 'border-rule bg-paper text-muted hover:border-brand-primary'
              }`}
            >
              {zone}
            </button>
          ))}
        </div>
      </fieldset>
    </>
  );
}
