import { RegistrationForm } from '@/features/public-registration/types';
import { formatRegistrationDate } from '@/features/public-registration/utils';

export function RegistrationReviewStep({ form }: { form: RegistrationForm }) {
  const details = [
    ['Nombre', `${form.firstName} ${form.lastName}`],
    ['Celular', form.phoneNumber],
    ['Zona', form.deliveryZone],
    ['Inicio preferido', formatRegistrationDate(form.preferredStartDate)],
    ['Peso · talla', `${form.weight} kg · ${form.height} cm`],
  ];

  return (
    <div className="mt-4 border-y border-hairline py-4">
      <dl className="space-y-3 text-[13px]">
        {details.map(([label, value]) => (
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
  );
}
