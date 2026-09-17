import { FormEvent, useState } from 'react';
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
  restrictions: [] as string[],
  underlyingDiseases: [] as string[],
  otherUnderlyingDisease: '',
  operations: [] as string[],
  medications: [] as string[],
};

type FormState = typeof initial;
type ListField = 'restrictions' | 'operations' | 'medications';

const tomorrow = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
};

const fieldCls =
  'w-full rounded-[10px] border border-rule bg-paper px-3.5 py-3 text-[13px] text-ink placeholder:text-placeholder outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10';

const stepLabels = ['Datos', 'Salud', 'Enviar'];
const stepTitles = ['Datos personales', 'Tu salud', 'Revisa tus datos'];

function BrandHeader() {
  return (
    <header className="bg-brand-primary px-6 py-5 text-brand-on-primary md:bg-transparent md:px-0 md:py-0">
      <p className="brand-oliva text-[44px] leading-none">La Oliva</p>
      <p className="mt-3 text-[9px] font-medium uppercase tracking-[0.22em] text-brand-on-primary/90">
        Catering · con altura
      </p>
    </header>
  );
}

function Progress({ step }: { step: number }) {
  return (
    <ol className="mx-auto flex max-w-[330px] items-start justify-between">
      {stepLabels.map((label, index) => {
        const number = index + 1;
        const active = number <= step;
        return (
          <li key={label} className="flex w-16 flex-col items-center gap-2 text-center">
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full border text-[11px] ${
                active
                  ? 'border-brand-primary bg-brand-primary text-brand-on-primary'
                  : 'border-rule bg-paper text-faint'
              }`}
            >
              {number}
            </span>
            <span
              className={`text-[9px] font-medium uppercase tracking-[0.08em] ${
                active ? 'text-ink' : 'text-faint'
              }`}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function ListEditor({
  label,
  items,
  onAdd,
  onRemove,
}: {
  label: string;
  items: string[];
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
}) {
  const [draft, setDraft] = useState('');
  const add = () => {
    onAdd(draft);
    setDraft('');
  };

  return (
    <div>
      <p className="mb-2 text-[12px] font-semibold text-ink-2">{label}</p>
      <div className="min-h-[76px] rounded-[10px] border border-dashed border-rule bg-paper px-2.5 py-2">
        <div className="flex flex-wrap gap-1.5">
          {items.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 rounded-full bg-cream-2 px-2.5 py-1 text-[11px] text-ink-2"
            >
              {item}
              <button
                type="button"
                aria-label={`Quitar ${item}`}
                onClick={() => onRemove(item)}
                className="text-muted transition hover:text-ink"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="mt-1 flex items-center gap-2">
          <input
            aria-label={`Agregar ${label.toLowerCase()}`}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                add();
              }
            }}
            placeholder={`+ Agregar ${label.toLowerCase().replace('alergias, intolerancias y gustos', '')}`}
            className="min-w-0 flex-1 bg-transparent px-0.5 py-1 text-[11px] text-ink outline-none placeholder:text-muted"
          />
          {draft && (
            <button
              type="button"
              onClick={add}
              className="text-[11px] font-semibold text-brand-primary hover:text-brand-primary-hover"
            >
              Agregar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const formatDate = (value: string) => {
  if (!value) return '—';
  return new Intl.DateTimeFormat('es-BO').format(new Date(`${value}T12:00:00`));
};

export function PublicRegistrationPage() {
  const [form, setForm] = useState<FormState>(initial);
  const [step, setStep] = useState(1);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const update = (key: keyof FormState, value: string) =>
    setForm((previous) => ({ ...previous, [key]: value }));
  const updateList = (key: ListField, value: string) => {
    const item = value.trim();
    if (!item || form[key].includes(item)) return;
    setForm((previous) => ({ ...previous, [key]: [...previous[key], item] }));
  };
  const removeListItem = (key: ListField, item: string) =>
    setForm((previous) => ({
      ...previous,
      [key]: previous[key].filter((value) => value !== item),
    }));
  const toggleDisease = (disease: string) =>
    setForm((previous) => ({
      ...previous,
      underlyingDiseases: previous.underlyingDiseases.includes(disease)
        ? previous.underlyingDiseases.filter((item) => item !== disease)
        : [...previous.underlyingDiseases, disease],
    }));

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (step < 3) {
      if (!event.currentTarget.checkValidity()) {
        event.currentTarget.reportValidity();
        return;
      }
      if (step === 1 && !form.deliveryZone) {
        setError('Selecciona una zona para continuar.');
        return;
      }
      setStep((current) => current + 1);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/public/client-intakes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          weight: Number(form.weight),
          height: Number(form.height),
        }),
      });
      if (res.ok) setSent(true);
      else setError('No pudimos enviar tu solicitud. Intenta nuevamente.');
    } catch {
      setError('No pudimos enviar tu solicitud. Intenta nuevamente.');
    }
  };

  const previous = () => {
    setError('');
    setStep((current) => current - 1);
  };

  const title = stepTitles[step - 1];

  return (
    <main className="min-h-screen bg-[#171717] px-0 py-0 md:bg-cream md:p-0">
      <div className="mx-auto flex min-h-screen max-w-[430px] overflow-hidden rounded-[24px] border border-rule bg-paper md:max-w-[1440px] md:rounded-[24px]">
        <aside className="hidden w-[43%] flex-col justify-between bg-brand-primary p-[44px] text-brand-on-primary md:flex">
          <BrandHeader />
          <div>
            <h1 className="max-w-[360px] font-serif text-[42px] leading-[1.05]">
              Comencemos a cuidar de ti
            </h1>
            <p className="mt-5 text-[14px] text-brand-on-primary/90">Cuéntanos un poco sobre ti.</p>
          </div>
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-brand-on-primary/80">
            Tu bienestar, a tu ritmo
          </p>
        </aside>

        <section className="flex min-h-screen w-full flex-col md:w-[57%] md:overflow-y-auto">
          <div className="md:hidden">
            <BrandHeader />
          </div>
          {sent ? (
            <div className="flex flex-1 flex-col items-center justify-center px-8 pb-20 text-center">
              <span className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-ok-bg font-serif text-[40px] text-brand-primary">
                ✓
              </span>
              <h1 className="mt-7 font-serif text-[31px] leading-none text-ink">
                Recibimos tu solicitud
              </h1>
              <p className="mt-4 text-[13px] text-muted">Nos comunicaremos contigo pronto.</p>
            </div>
          ) : (
            <div className="mx-auto flex w-full max-w-[500px] flex-1 flex-col px-6 pb-7 pt-7 sm:px-8 md:max-w-[442px] md:px-0 md:pt-7">
              <div className="md:hidden">
                <h1 className="font-serif text-[30px] leading-none text-ink">
                  Comencemos a cuidar de ti
                </h1>
                <p className="mt-3 text-[13px] text-muted">Cuéntanos un poco sobre ti.</p>
              </div>
              <div className="mt-7 md:mt-0">
                <Progress step={step} />
              </div>
              <form onSubmit={submit} className="mt-8 flex flex-1 flex-col">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.17em] text-brand-primary md:hidden">
                    {title}
                  </p>
                  <h2 className="hidden font-serif text-[31px] leading-none text-ink md:block">
                    {title}
                  </h2>
                  {step === 1 && (
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
                            className={`${fieldCls} mt-2`}
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
                            className={`${fieldCls} mt-2`}
                          />
                        </label>
                        <label htmlFor="sex" className="text-[11px] font-semibold text-ink-2">
                          Sexo <span className="text-required">*</span>
                          <select
                            id="sex"
                            required
                            value={form.sex}
                            onChange={(event) => update('sex', event.target.value)}
                            className={`${fieldCls} mt-2 pr-9`}
                          >
                            <option value="">Seleccionar...</option>
                            <option value="female">Femenino</option>
                            <option value="male">Masculino</option>
                            <option value="other">Otro</option>
                          </select>
                        </label>
                        <label
                          htmlFor="dateOfBirth"
                          className="text-[11px] font-semibold text-ink-2"
                        >
                          Fecha de nacimiento <span className="text-required">*</span>
                          <input
                            id="dateOfBirth"
                            type="date"
                            required
                            max={new Date().toISOString().slice(0, 10)}
                            value={form.dateOfBirth}
                            onChange={(event) => update('dateOfBirth', event.target.value)}
                            className={`${fieldCls} mt-2`}
                          />
                        </label>
                        <label
                          htmlFor="phoneNumber"
                          className="text-[11px] font-semibold text-ink-2"
                        >
                          Celular <span className="text-required">*</span>
                          <input
                            id="phoneNumber"
                            required
                            value={form.phoneNumber}
                            onChange={(event) => update('phoneNumber', event.target.value)}
                            placeholder="7XX XXX XX"
                            className={`${fieldCls} mt-2`}
                          />
                        </label>
                        <label
                          htmlFor="preferredStartDate"
                          className="text-[11px] font-semibold text-ink-2"
                        >
                          ¿Cuándo quiere iniciar su plan? <span className="text-required">*</span>
                          <input
                            id="preferredStartDate"
                            type="date"
                            required
                            min={tomorrow()}
                            value={form.preferredStartDate}
                            onChange={(event) => update('preferredStartDate', event.target.value)}
                            className={`${fieldCls} mt-2`}
                          />
                        </label>
                      </div>
                      <label
                        htmlFor="address"
                        className="mt-4 block text-[11px] font-semibold text-ink-2"
                      >
                        Dirección detallada <span className="text-required">*</span>
                        <input
                          id="address"
                          required
                          value={form.address}
                          onChange={(event) => update('address', event.target.value)}
                          placeholder="Calle, número, edificio y referencia"
                          className={`${fieldCls} mt-2`}
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
                              className={`rounded-full border px-3.5 py-2 text-[11px] font-semibold ${form.deliveryZone === zone ? 'border-brand-primary bg-cream-2 text-ink' : 'border-rule bg-paper text-muted hover:border-brand-primary'}`}
                            >
                              {zone}
                            </button>
                          ))}
                        </div>
                      </fieldset>
                    </>
                  )}
                  {step === 2 && (
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
                            className={`${fieldCls} mt-2`}
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
                            className={`${fieldCls} mt-2`}
                          />
                        </label>
                      </div>
                      <ListEditor
                        label="Alergias, intolerancias y gustos"
                        items={form.restrictions}
                        onAdd={(value) => updateList('restrictions', value)}
                        onRemove={(value) => removeListItem('restrictions', value)}
                      />
                      <div>
                        <p className="mb-2 text-[12px] font-semibold text-ink-2">
                          Enfermedades de base
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {DISEASES.map((disease) => (
                            <button
                              key={disease}
                              type="button"
                              aria-pressed={form.underlyingDiseases.includes(disease)}
                              onClick={() => toggleDisease(disease)}
                              className={`rounded-full border px-3 py-2 text-[11px] font-semibold ${form.underlyingDiseases.includes(disease) ? 'border-brand-primary bg-cream-2 text-ink' : 'border-rule bg-paper text-muted hover:border-brand-primary'}`}
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
                              onChange={(event) =>
                                update('otherUnderlyingDisease', event.target.value)
                              }
                              className={`${fieldCls} mt-2`}
                            />
                          </label>
                        )}
                      </div>
                      <ListEditor
                        label="Operaciones"
                        items={form.operations}
                        onAdd={(value) => updateList('operations', value)}
                        onRemove={(value) => removeListItem('operations', value)}
                      />
                      <ListEditor
                        label="Medicamentos"
                        items={form.medications}
                        onAdd={(value) => updateList('medications', value)}
                        onRemove={(value) => removeListItem('medications', value)}
                      />
                    </div>
                  )}
                  {step === 3 && (
                    <div className="mt-4 border-y border-hairline py-4">
                      <dl className="space-y-3 text-[13px]">
                        {[
                          ['Nombre', `${form.firstName} ${form.lastName}`],
                          ['Celular', form.phoneNumber],
                          ['Zona', form.deliveryZone],
                          ['Inicio preferido', formatDate(form.preferredStartDate)],
                          ['Peso · talla', `${form.weight} kg · ${form.height} cm`],
                        ].map(([label, value]) => (
                          <div key={label} className="flex justify-between gap-5">
                            <dt className="text-muted">{label}</dt>
                            <dd className="text-right font-medium text-ink">{value}</dd>
                          </div>
                        ))}
                      </dl>
                      <p className="mt-5 border-t border-hairline pt-4 text-[12px] leading-[1.45] text-muted">
                        Un miembro de nuestro equipo revisará tu solicitud y se comunicará contigo.
                      </p>
                    </div>
                  )}
                </div>
                <input
                  aria-hidden="true"
                  tabIndex={-1}
                  className="hidden"
                  value={form.website}
                  onChange={(event) => update('website', event.target.value)}
                />
                {error && <p className="mt-4 text-[12px] text-alert">{error}</p>}
                <div className="mt-auto flex items-center justify-between pt-8">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={previous}
                      className="px-4 py-3 text-[12px] font-semibold text-brand-primary hover:text-brand-primary-hover"
                    >
                      Anterior
                    </button>
                  ) : (
                    <span />
                  )}
                  <span className="text-[11px] text-faint">Paso {step} de 3</span>
                  <button
                    type="submit"
                    className="rounded-[9px] bg-brand-primary px-5 py-3 text-[12px] font-semibold text-brand-on-primary shadow-card-elevated transition hover:bg-brand-primary-hover"
                  >
                    {step === 3 ? 'Enviar solicitud' : 'Continuar'}
                  </button>
                </div>
              </form>
              <div className="mt-5 flex justify-center gap-5 text-[10px]">
                <span className="rounded-[8px] bg-cream-2 px-3 py-2 font-semibold text-ink">
                  Formulario
                </span>
                <span className="px-1 py-2 text-muted">Confirmación</span>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
