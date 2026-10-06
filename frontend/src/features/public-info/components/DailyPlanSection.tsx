import { MEALS } from '@/features/public-info/content';
import { SectionHeading } from './SectionHeading';

export function DailyPlanSection() {
  return (
    <section id="plan-completo" className="border-y border-public-rule bg-public-paper">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-12 px-6 py-[72px]">
        <div className="flex min-w-0 flex-[1_1_360px] flex-col gap-5">
          <SectionHeading size="lg">
            Tu alimentación diaria,{' '}
            <em className="font-public-script text-[1.3em] font-normal not-italic text-public-terracotta">
              resuelta
            </em>
          </SectionHeading>
          <p className="m-0 text-[16px] leading-[1.65] text-public-body">
            Durante 20 días, de lunes a viernes, te entregamos tus comidas del día, listas para que
            disfrutes una alimentación práctica, variada y equilibrada.
          </p>
          <div className="mt-2 rounded-[18px] bg-public-cream-2 px-7 py-6 text-center">
            <p className="m-0 font-public-display text-[28px] leading-[1.2] text-public-terracotta">
              <span className="block">5 o 6 comidas diarias</span>
              <span className="block">+ jugo vitamínico</span>
            </p>
            <p className="m-0 mt-2.5 flex items-center justify-center gap-3 text-[14px] text-public-body">
              <span aria-hidden="true" className="inline-block h-px w-9 bg-public-terracotta" />
              de lunes a viernes
              <span aria-hidden="true" className="inline-block h-px w-9 bg-public-terracotta" />
            </p>
          </div>
        </div>

        <div className="grid min-w-0 flex-[1.2_1_440px] grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4">
          {MEALS.map((meal) => (
            <figure
              key={meal.label}
              className="m-0 overflow-hidden rounded-2xl border border-public-rule bg-public-cream"
            >
              {/* The photos are low-resolution crops from the slides, so they are shown whole on a
                  cream letterbox rather than cropped to fill the card. */}
              <img
                src={meal.image}
                alt={meal.alt}
                className="block aspect-[3/2] h-auto w-full bg-public-cream-2 object-contain"
              />
              <figcaption className="px-3.5 py-3 text-center font-public-display text-[18px] text-public-ink">
                {meal.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
