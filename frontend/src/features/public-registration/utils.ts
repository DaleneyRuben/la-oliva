export const publicRegistrationFieldClass =
  'w-full rounded-[10px] border border-rule bg-paper px-3.5 py-3 text-[13px] text-ink placeholder:text-placeholder outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10';

export const getTomorrow = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
};

export const formatRegistrationDate = (value: string) => {
  if (!value) return '—';
  return new Intl.DateTimeFormat('es-BO').format(new Date(`${value}T12:00:00`));
};
