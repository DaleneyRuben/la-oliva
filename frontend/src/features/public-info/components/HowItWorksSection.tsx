import { NOTICES, STEPS } from '@/features/public-info/content';
import { useReveal } from '@/features/public-info/hooks/useReveal';
import { PublicInfoIcon } from './PublicInfoIcon';
import { SectionHeading } from './SectionHeading';

export function HowItWorksSection() {
  const steps = useReveal<HTMLOListElement>({ stagger: true });
  const notices = useReveal<HTMLUListElement>({ stagger: true });

  return (
    <section className="border-y border-public-rule bg-public-paper">
      <div className="mx-auto flex max-w-[1200px] flex-wrap gap-12 px-6 py-[72px]">
        <div className="flex min-w-0 flex-[1.1_1_420px] flex-col gap-6">
          <SectionHeading className="scroll-mt-6">
            <span id="how-it-works-label">¿Cómo funciona?</span>
          </SectionHeading>
          <ol
            ref={steps.ref}
            aria-labelledby="how-it-works-label"
            className={`m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(128px,1fr))] gap-3.5 p-0 ${steps.className}`}
          >
            {STEPS.map((step, index) => (
              <li
                key={step.text}
                className="flex flex-col items-center gap-3 rounded-[18px] border border-public-rule bg-public-cream px-4 py-[22px] text-center"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-public-tan text-[13px] font-semibold text-public-paper">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className={index % 2 === 0 ? 'text-public-olive' : 'text-public-ink'}>
                  <PublicInfoIcon name={step.icon} size={28} />
                </span>
                <span className="text-[14px] leading-[1.4] text-public-ink">{step.text}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="flex min-w-0 flex-[1_1_400px] flex-col gap-5">
          <SectionHeading>
            <span id="notices-label">Importante antes de contratar</span>
          </SectionHeading>
          <ul
            ref={notices.ref}
            aria-labelledby="notices-label"
            className={`m-0 flex list-none flex-col gap-2.5 p-0 ${notices.className}`}
          >
            {NOTICES.map((notice) => (
              <li
                key={notice.text}
                className="flex items-start gap-3.5 rounded-[14px] border border-public-rule bg-public-cream px-4 py-3.5 text-[14px] leading-[1.5] text-public-ink"
              >
                <span className="flex-none text-public-price">
                  <PublicInfoIcon name={notice.icon} size={24} />
                </span>
                <span>{notice.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
