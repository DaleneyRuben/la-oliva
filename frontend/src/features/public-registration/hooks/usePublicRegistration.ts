import { useState } from 'react';
import { API_BASE } from '@/utils/env';
import {
  createInitialRegistrationForm,
  ListField,
  RegistrationForm,
  UpdateRegistrationForm,
} from '@/features/public-registration/types';

export function usePublicRegistration() {
  const [form, setForm] = useState<RegistrationForm>(createInitialRegistrationForm);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const update: UpdateRegistrationForm = (key, value) =>
    setForm((previous) => ({ ...previous, [key]: value }));

  const addListItem = (key: ListField, value: string) => {
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

  const submit = async () => {
    setError('');

    try {
      const response = await fetch(`${API_BASE}/public/client-intakes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          weight: Number(form.weight),
          height: Number(form.height),
        }),
      });

      if (response.ok) setSent(true);
      else setError('No pudimos enviar tu solicitud. Intenta nuevamente.');
    } catch {
      setError('No pudimos enviar tu solicitud. Intenta nuevamente.');
    }
  };

  return {
    form,
    error,
    sent,
    update,
    addListItem,
    removeListItem,
    toggleDisease,
    submit,
    clearError: () => setError(''),
    setError,
  };
}
