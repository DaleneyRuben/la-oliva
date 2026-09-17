import { RegistrationForm, UpdateRegistrationForm } from '@/features/public-registration/types';
import { getTomorrow, publicRegistrationFieldClass } from '@/features/public-registration/utils';

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
            <option value="other">Otro</option>
          </select>
        </label>
        <label htmlFor="dateOfBirth" className="text-[11px] font-semibold text-ink-2">
          Fecha de nacimiento <span className="text-required">*</span>
          <input
            id="dateOfBirth"
            type="date"
            required
            max={new Date().toISOString().slice(0, 10)}
            value={form.dateOfBirth}
            onChange={(event) => update('dateOfBirth', event.target.value)}
            className={`${publicRegistrationFieldClass} mt-2`}
          />
        </label>
        <label htmlFor="phoneNumber" className="text-[11px] font-semibold text-ink-2">
          Celular <span className="text-required">*</span>
          <input
            id="phoneNumber"
            required
            value={form.phoneNumber}
            onChange={(event) => update('phoneNumber', event.target.value)}
            placeholder="7XX XXX XX"
            className={`${publicRegistrationFieldClass} mt-2`}
          />
        </label>
        <label htmlFor="preferredStartDate" className="text-[11px] font-semibold text-ink-2">
          ¿Cuándo quiere iniciar su plan? <span className="text-required">*</span>
          <input
            id="preferredStartDate"
            type="date"
            required
            min={getTomorrow()}
            value={form.preferredStartDate}
            onChange={(event) => update('preferredStartDate', event.target.value)}
            className={`${publicRegistrationFieldClass} mt-2`}
          />
        </label>
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
