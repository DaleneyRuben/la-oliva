import { FormEvent, useState } from 'react';
import { Button } from '@ui/Button';
import { Field, inputCls } from '@ui/Field';
import { API_BASE } from '@/utils/env';
import { DISEASES } from '@/features/clients/constants/diseases';

const initial = {
  firstName: '',
  lastName: '',
  sex: '',
  dateOfBirth: '',
  phoneNumber: '',
  address: '',
  deliveryZone: '',
  preferredStartDate: '',
  weight: '',
  height: '',
  website: '',
  restrictions: '',
  underlyingDiseases: [] as string[],
  otherUnderlyingDisease: '',
  operations: '',
  medications: '',
};

const tomorrow = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
};

const splitList = (value: string) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

export function PublicRegistrationPage() {
  const [form, setForm] = useState(initial);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const update = (key: keyof typeof initial, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));
  const toggleDisease = (disease: string) =>
    setForm((prev) => ({
      ...prev,
      underlyingDiseases: prev.underlyingDiseases.includes(disease)
        ? prev.underlyingDiseases.filter((item) => item !== disease)
        : [...prev.underlyingDiseases, disease],
    }));
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    const preferredStart = new Date(`${form.preferredStartDate}T12:00:00`);
    if (preferredStart.getDay() === 0 || preferredStart.getDay() === 6) {
      setError('Elige un día de lunes a viernes para iniciar tu plan.');
      return;
    }
    const res = await fetch(`${API_BASE}/public/client-intakes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        restrictions: splitList(form.restrictions),
        underlyingDiseases: form.underlyingDiseases,
        operations: splitList(form.operations),
        medications: splitList(form.medications),
        weight: Number(form.weight),
        height: Number(form.height),
      }),
    });
    if (res.ok) setSent(true);
    else setError('No pudimos enviar tu solicitud. Intenta nuevamente.');
  };
  if (sent)
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center p-6">
        <p className="font-serif text-2xl text-ink text-center">
          Recibimos tu solicitud. Nos comunicaremos contigo pronto.
        </p>
      </main>
    );
  return (
    <main className="min-h-screen bg-cream py-8 px-4">
      <form
        onSubmit={submit}
        className="max-w-xl mx-auto bg-paper border border-rule rounded-[14px] p-5 sm:p-8 space-y-5"
      >
        <h1 className="font-serif text-3xl text-ink">Cuéntanos un poco sobre ti.</h1>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Nombre" htmlFor="firstName" required>
            <input
              id="firstName"
              required
              value={form.firstName}
              onChange={(e) => update('firstName', e.target.value)}
              className={inputCls()}
            />
          </Field>
          <Field label="Apellido" htmlFor="lastName" required>
            <input
              id="lastName"
              required
              value={form.lastName}
              onChange={(e) => update('lastName', e.target.value)}
              className={inputCls()}
            />
          </Field>
          <Field label="Fecha de nacimiento" htmlFor="dateOfBirth" required>
            <input
              id="dateOfBirth"
              type="date"
              required
              max={new Date().toISOString().slice(0, 10)}
              value={form.dateOfBirth}
              onChange={(e) => update('dateOfBirth', e.target.value)}
              className={inputCls()}
            />
          </Field>
          <Field label="Celular" htmlFor="phoneNumber" required>
            <input
              id="phoneNumber"
              required
              value={form.phoneNumber}
              onChange={(e) => update('phoneNumber', e.target.value)}
              className={inputCls()}
            />
          </Field>
          <Field label="Peso (kg)" htmlFor="weight" required>
            <input
              id="weight"
              type="number"
              min="0.1"
              step="0.1"
              required
              value={form.weight}
              onChange={(e) => update('weight', e.target.value)}
              className={inputCls()}
            />
          </Field>
          <Field label="Talla (cm)" htmlFor="height" required>
            <input
              id="height"
              type="number"
              min="1"
              required
              value={form.height}
              onChange={(e) => update('height', e.target.value)}
              className={inputCls()}
            />
          </Field>
        </div>
        <Field label="Sexo" htmlFor="sex" required>
          <select
            id="sex"
            required
            value={form.sex}
            onChange={(e) => update('sex', e.target.value)}
            className={inputCls()}
          >
            <option value="">Seleccionar…</option>
            <option value="female">Femenino</option>
            <option value="male">Masculino</option>
            <option value="other">Otro</option>
          </select>
        </Field>
        <Field label="Dirección detallada" htmlFor="address" required>
          <input
            id="address"
            required
            value={form.address}
            onChange={(e) => update('address', e.target.value)}
            className={inputCls()}
          />
        </Field>
        <Field label="Zona" htmlFor="deliveryZone" required>
          <select
            id="deliveryZone"
            required
            value={form.deliveryZone}
            onChange={(e) => update('deliveryZone', e.target.value)}
            className={inputCls()}
          >
            <option value="">Seleccionar…</option>
            <option>Centro</option>
            <option>Sur</option>
          </select>
        </Field>
        <Field label="¿Cuándo quiere iniciar su plan?" htmlFor="preferredStartDate" required>
          <input
            id="preferredStartDate"
            type="date"
            required
            min={tomorrow()}
            value={form.preferredStartDate}
            onChange={(e) => update('preferredStartDate', e.target.value)}
            className={inputCls()}
          />
        </Field>
        <Field label="Alergias, intolerancias y gustos" htmlFor="restrictions">
          <input
            id="restrictions"
            placeholder="Ej. maní, lácteos, cebolla"
            value={form.restrictions}
            onChange={(e) => update('restrictions', e.target.value)}
            className={inputCls()}
          />
        </Field>
        <div>
          <p className="text-[13.5px] font-bold text-ink mb-2">Enfermedades de base</p>
          <div className="flex flex-wrap gap-2">
            {DISEASES.map((disease) => (
              <label
                key={disease}
                htmlFor={`disease-${disease}`}
                className="inline-flex items-center gap-1.5 text-sm text-ink-2"
              >
                <input
                  id={`disease-${disease}`}
                  type="checkbox"
                  checked={form.underlyingDiseases.includes(disease)}
                  onChange={() => toggleDisease(disease)}
                />
                {disease}
              </label>
            ))}
          </div>
          {form.underlyingDiseases.includes('Otro') && (
            <Field label="Especificar enfermedad" htmlFor="otherUnderlyingDisease" required>
              <input
                id="otherUnderlyingDisease"
                required
                value={form.otherUnderlyingDisease}
                onChange={(e) => update('otherUnderlyingDisease', e.target.value)}
                className={inputCls()}
              />
            </Field>
          )}
        </div>
        <Field label="Operaciones" htmlFor="operations">
          <input
            id="operations"
            placeholder="Separar con comas"
            value={form.operations}
            onChange={(e) => update('operations', e.target.value)}
            className={inputCls()}
          />
        </Field>
        <Field label="Medicamentos" htmlFor="medications">
          <input
            id="medications"
            placeholder="Separar con comas"
            value={form.medications}
            onChange={(e) => update('medications', e.target.value)}
            className={inputCls()}
          />
        </Field>
        <input
          aria-hidden="true"
          tabIndex={-1}
          className="hidden"
          value={form.website}
          onChange={(e) => update('website', e.target.value)}
        />
        <p className="text-alert text-sm">{error}</p>
        <Button type="submit" className="w-full">
          Enviar solicitud
        </Button>
      </form>
    </main>
  );
}
