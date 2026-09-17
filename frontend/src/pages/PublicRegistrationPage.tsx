import { FormEvent, useState } from 'react';
import { Button } from '@ui/Button';
import { Field, inputCls } from '@ui/Field';
import { API_BASE } from '@/utils/env';

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
};

export function PublicRegistrationPage() {
  const [form, setForm] = useState(initial);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const update = (key: keyof typeof initial, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    const res = await fetch(`${API_BASE}/public/client-intakes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, weight: Number(form.weight), height: Number(form.height) }),
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
            value={form.preferredStartDate}
            onChange={(e) => update('preferredStartDate', e.target.value)}
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
