import { Icon } from '@ui/Icon';
import panelPhoto from '@/assets/public-info/panel.jpg';
import { BEFORE_STARTING, PLAN_INCLUDES, TONE_BG } from '@/features/public-info/content';
import { PublicInfoIcon } from './PublicInfoIcon';
import { SectionHeading } from './SectionHeading';

export function IncludesSection() {
  return (
    <section
      id="que-incluye"
      className="mx-auto flex max-w-[1200px] flex-wrap items-stretch gap-8 px-6 py-[72px]"
    >
      <div className="flex min-w-0 flex-[1.3_1_480px] flex-wrap overflow-hidden rounded-3xl bg-public-olive text-public-cream">
        <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-[18px] px-9 py-10">
          <h2 className="m-0 font-public-display text-[32px] font-medium leading-[1.05] md:text-[40px]">
            Más que solo comida
          </h2>
          <p
            id="plan-includes-label"
            className="m-0 text-[11px] font-semibold uppercase tracking-[0.22em] text-public-olive-text"
          >
            ¿Qué incluye tu plan?
          </p>
          <ul
            aria-labelledby="plan-includes-label"
            className="m-0 mt-1 flex list-none flex-col gap-[11px] p-0 text-[15px] leading-[1.45]"
          >
            {PLAN_INCLUDES.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-px inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-public-cream text-public-olive">
                  <Icon name="check" size={12} stroke={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>
          <p className="m-0 mt-2.5 text-[14px] leading-[1.6] text-public-olive-soft">
            La idea es sencilla: que tengas todo preparado y puedas concentrarte en tu día mientras
            nosotros nos ocupamos de tus comidas.
          </p>
        </div>
        <div className="relative m-5 w-full max-w-[280px] flex-[0_1_280px] self-center">
          <img
            src={panelPhoto}
            alt="Envases con pasta y pollo listos para entregar"
            className="block h-auto w-full rounded-[18px]"
          />
          <p className="absolute -right-[18px] -top-[18px] m-0 box-border flex h-[132px] w-[132px] -rotate-[8deg] items-center justify-center rounded-full bg-public-cream p-4 text-center font-public-script text-[26px] leading-[1.05] text-public-ink shadow-public-sticker">
            Comida real para una vida real
          </p>
        </div>
      </div>

      <div className="flex min-w-0 flex-[1_1_320px] flex-col justify-center gap-5">
        <SectionHeading>Antes de comenzar</SectionHeading>
        <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3.5 p-0">
          {BEFORE_STARTING.map((card) => (
            <li
              key={card.title}
              className="flex flex-col items-center gap-3 rounded-[18px] border border-public-rule bg-public-paper px-4 py-[22px] text-center"
            >
              <span
                className={`flex h-14 w-14 items-center justify-center rounded-full text-public-paper ${TONE_BG[card.tone]}`}
              >
                <PublicInfoIcon name={card.icon} size={26} />
              </span>
              <span className="font-public-display text-[18px] leading-[1.2] text-public-ink">
                {card.title}
              </span>
              {card.emphasis ? (
                <span className="font-public-display text-[24px] text-public-price">
                  {card.detail}
                </span>
              ) : (
                <span className="text-[12px] leading-[1.4] text-public-muted">{card.detail}</span>
              )}
            </li>
          ))}
        </ul>
        <p className="m-0 mt-1.5 text-[15px] leading-[1.6] text-public-body">
          Con esta valoración previa personalizamos la alimentación según tus objetivos y gustos.
        </p>
      </div>
    </section>
  );
}
