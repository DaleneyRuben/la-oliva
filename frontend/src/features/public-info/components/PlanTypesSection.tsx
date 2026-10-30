import { useState } from 'react';
import { Button } from '@ui/Button';
import { LUNCH_DINNER_PLAN_IMAGES, PLAN_TYPES, TONE_TEXT } from '@/features/public-info/content';
import { usePreloadImages } from '@/features/public-info/hooks/usePreloadImages';
import { useReveal } from '@/features/public-info/hooks/useReveal';
import { Botanical } from './Botanical';
import { LunchDinnerPlanModal } from './LunchDinnerPlanModal';
import { PublicInfoIcon } from './PublicInfoIcon';
import { SectionHeading } from './SectionHeading';

const PLAN_IMAGE_SOURCES = LUNCH_DINNER_PLAN_IMAGES.map((image) => image.src);

export function PlanTypesSection() {
  const plans = useReveal<HTMLUListElement>({ stagger: true });
  const [planModalOpen, setPlanModalOpen] = useState(false);
  // The flyers are heavy: fetch them as soon as the plan cards are on screen, not on click.
  usePreloadImages(PLAN_IMAGE_SOURCES, plans.visible);

  return (
    <section
      id="tipos-de-plan"
      className="relative overflow-hidden border-y border-public-rule bg-public-paper"
    >
      <Botanical name="branch" className="bottom-0 left-0 w-[120px] md:w-[200px]" />
      <Botanical name="branch" className="bottom-0 right-0 w-[120px] -scale-x-100 md:hidden" />
      <Botanical name="corner" className="right-0 top-[90px] hidden w-[120px] md:block" />
      <div className="relative mx-auto flex max-w-[1200px] flex-col items-center gap-7 px-6 pb-[132px] pt-[72px] md:pb-[72px]">
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
        <Button
          variant="bare"
          onClick={() => setPlanModalOpen(true)}
          className="attention-pulse mt-2 w-full gap-3.5 rounded-[22px] bg-public-olive py-2.5 pl-2.5 pr-3 text-left text-[15px] font-semibold leading-snug text-public-cream hover:bg-public-ink md:w-auto md:gap-4 md:rounded-full md:text-[17px]"
        >
          <span className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-full bg-public-cream text-public-olive">
            <PublicInfoIcon name="cutlery" size={22} stroke={1.8} />
          </span>
          <span className="flex-1">Además contamos con plan de Almuerzos y/o Cena</span>
          <span className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-full bg-public-cream/20">
            <PublicInfoIcon name="chevron-right" size={18} stroke={2.2} />
          </span>
        </Button>
      </div>
      {planModalOpen && (
        <LunchDinnerPlanModal
          images={LUNCH_DINNER_PLAN_IMAGES}
          onClose={() => setPlanModalOpen(false)}
        />
      )}
    </section>
  );
}
