import { Icon } from '@ui/Icon';
import { PLAN_TYPES, TONE_TEXT } from '@/features/public-info/content';
import { useReveal } from '@/features/public-info/hooks/useReveal';
import { PublicInfoIcon } from './PublicInfoIcon';
import { SectionHeading } from './SectionHeading';

export function PlanTypesSection() {
  const plans = useReveal<HTMLUListElement>({ stagger: true });

  return (
    <section id="tipos-de-plan" className="border-y border-public-rule bg-public-paper">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-7 px-6 py-[72px]">
        <div className="flex flex-col gap-2.5 text-center">
          <SectionHeading size="lg" align="center">
            Nuestros planes
          </SectionHeading>
          <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.22em] text-public-olive">
            Elige el plan que se adapta a ti
          </p>
        </div>
        <ul
          ref={plans.ref}
          className={`m-0 grid w-full list-none grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-4 p-0 ${plans.className}`}
        >
          {PLAN_TYPES.map((plan) => (
            <li
              key={plan.name}
              className="flex flex-col items-center gap-2.5 rounded-[18px] border border-public-rule bg-public-cream px-[18px] py-[26px] text-center transition hover:-translate-y-0.5 hover:shadow-public-badge"
            >
              <span className={TONE_TEXT[plan.tone]}>
                <PublicInfoIcon name={plan.icon} size={34} />
              </span>
              <span className="font-public-display text-[24px] leading-[1.1] text-public-ink">
                {plan.name}
              </span>
              <span className="text-[14px] text-public-body">{plan.meals}</span>
            </li>
          ))}
        </ul>
        <p className="m-0 inline-flex items-center gap-3 rounded-full border border-public-orange bg-public-paper px-[22px] py-3 text-[14px] text-public-ink">
          <span className="text-public-orange">
            <Icon name="utensils" size={18} stroke={1.8} />
          </span>
          Además contamos con plan de Almuerzos y/o Cena
        </p>
      </div>
    </section>
  );
}
