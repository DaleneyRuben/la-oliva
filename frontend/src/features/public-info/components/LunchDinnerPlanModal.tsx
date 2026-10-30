import { useState } from 'react';
import { Button } from '@ui/Button';
import { Modal } from '@ui/Modal';
import { WHATSAPP_LINKS } from '@/constants/contact.constants';
import type { PlanImage } from '@/features/public-info/content';
import { PublicInfoIcon } from './PublicInfoIcon';

interface Props {
  images: PlanImage[];
  onClose: () => void;
}

const ROUND_BUTTON =
  'inline-flex h-11 w-11 flex-none p-0! items-center justify-center rounded-full transition';

export function LunchDinnerPlanModal({ images, onClose }: Props) {
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  const count = images.length;
  // Adding `count` before the modulo keeps "previous" from the first image positive.
  const goTo = (target: number) => setIndex((target + count) % count);

  return (
    <Modal
      onClose={onClose}
      className="flex max-h-[calc(100dvh-2rem)] w-full max-w-[1000px] flex-col overflow-y-auto rounded-[28px]! bg-public-paper! font-public-body text-public-ink md:flex-row md:overflow-hidden"
    >
      <div className="order-2 flex flex-none items-center justify-center px-5 md:order-1 md:w-[52%] md:bg-public-cream-2 md:p-5">
        <div
          aria-busy={!loaded[images[index].alt]}
          className="relative w-full overflow-hidden rounded-[18px] border border-public-rule bg-public-cream shadow-public-badge"
        >
          <div
            className="flex transition-transform duration-[400ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {images.map((image, i) => (
              <div key={image.alt} className="relative w-full flex-none">
                {!loaded[image.alt] && (
                  <div
                    data-testid="plan-image-placeholder"
                    aria-hidden="true"
                    className="absolute inset-0 animate-pulse bg-public-cream-2 motion-reduce:animate-none"
                  />
                )}
                <img
                  src={image.src}
                  alt={image.alt}
                  aria-hidden={i !== index}
                  onLoad={() => setLoaded((current) => ({ ...current, [image.alt]: true }))}
                  className={`relative block aspect-[1024/1400] w-full object-cover object-top transition-opacity duration-500 ${loaded[image.alt] ? 'opacity-100' : 'opacity-0'}`}
                />
              </div>
            ))}
          </div>
          {count > 1 && (
            <span className="absolute right-3 top-3 rounded-full bg-public-paper/90 px-2.5 py-1 text-[12px] font-semibold">
              {index + 1} / {count}
            </span>
          )}
        </div>
      </div>

      <div className="contents md:order-2 md:flex md:min-w-0 md:flex-1 md:flex-col md:gap-7 md:p-9">
        <header className="order-1 flex items-start justify-between gap-3 px-5 pb-4 pt-5 md:p-0">
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-public-terracotta md:text-[12px]">
              Además contamos con
            </span>
            <h2 className="m-0 font-public-display text-[26px] font-medium leading-[1.1] md:text-[40px] md:leading-[1.05]">
              Plan de Almuerzos <em className="text-public-olive">y/o</em> Cena
            </h2>
          </div>
          <Button
            variant="bare"
            aria-label="Cerrar"
            onClick={onClose}
            className={`${ROUND_BUTTON} border border-public-rule bg-public-cream text-public-ink hover:bg-public-cream-2`}
          >
            <PublicInfoIcon name="x" size={18} stroke={2} />
          </Button>
        </header>

        {count > 1 && (
          <div className="order-2 hidden md:grid md:grid-cols-3 md:gap-3.5 md:border-t md:border-public-rule md:pt-7">
            {images.map((image, i) => (
              <Button
                key={image.alt}
                variant="bare"
                aria-label={`Ver ${image.alt}`}
                aria-current={i === index}
                onClick={() => goTo(i)}
                className={`h-[180px] overflow-hidden rounded-[14px] border-2 bg-public-cream p-0! transition ${i === index ? 'border-public-terracotta' : 'border-transparent opacity-55 hover:opacity-100'}`}
              >
                <img
                  src={image.src}
                  alt=""
                  className="block h-full w-full object-cover object-top"
                />
              </Button>
            ))}
          </div>
        )}

        <div className="order-3 flex flex-col gap-4 px-5 pb-6 pt-4 md:mt-auto md:p-0">
          {count > 1 && (
            <div className="flex items-center justify-between">
              <Button
                variant="bare"
                aria-label="Imagen anterior"
                onClick={() => goTo(index - 1)}
                className={`${ROUND_BUTTON} border border-public-rule bg-public-paper text-public-olive hover:bg-public-cream`}
              >
                <PublicInfoIcon name="chevron-left" size={18} stroke={2.2} />
              </Button>
              <div className="flex items-center gap-2">
                {images.map((image, i) => (
                  <Button
                    key={image.alt}
                    variant="bare"
                    aria-label={`Ver imagen ${i + 1}`}
                    aria-current={i === index}
                    onClick={() => goTo(i)}
                    className={`h-2 rounded-full p-0! transition-all ${i === index ? 'w-[26px] bg-public-terracotta' : 'w-2 bg-public-rule'}`}
                  >
                    {null}
                  </Button>
                ))}
              </div>
              <Button
                variant="bare"
                aria-label="Imagen siguiente"
                onClick={() => goTo(index + 1)}
                className={`${ROUND_BUTTON} bg-public-olive text-public-cream hover:bg-public-ink`}
              >
                <PublicInfoIcon name="chevron-right" size={18} stroke={2.2} />
              </Button>
            </div>
          )}
          <a
            href={WHATSAPP_LINKS.hire}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[52px] items-center justify-center gap-2.5 rounded-full bg-public-olive px-6 text-[15px] font-semibold text-public-paper no-underline transition hover:bg-public-ink active:scale-[0.98] md:min-h-14 md:text-[16px]"
          >
            <PublicInfoIcon name="whatsapp" size={20} stroke={1.8} />
            Quiero contratar un plan
          </a>
        </div>
      </div>
    </Modal>
  );
}
