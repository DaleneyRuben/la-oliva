import { Icon } from '@ui/Icon';
import { WHATSAPP_LINKS } from '@/constants/contact.constants';
import { useReveal } from '@/features/public-info/hooks/useReveal';

import { PRICES, PRICE_NOTES } from '@/features/public-info/content';
import { SectionHeading } from './SectionHeading';
import { WhatsAppLink } from './WhatsAppLink';

export function PricingSection() {
  const prices = useReveal<HTMLUListElement>({ stagger: true });
  const delivery = useReveal<HTMLDivElement>();

  return (
    <section id="precios" className="mx-auto flex max-w-[1200px] flex-wrap gap-10 px-6 py-[72px]">
      <div className="flex min-w-0 flex-[1.2_1_440px] flex-col gap-[22px]">
        <SectionHeading>Precios planes completos</SectionHeading>
        <ul
          ref={prices.ref}
          className={`m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 p-0 ${prices.className}`}
        >
          {PRICES.map((card) => (
            <li
              key={card.title}
              className="flex flex-col gap-2 rounded-[18px] border border-public-rule bg-public-paper px-[22px] py-[26px] text-center transition hover:-translate-y-0.5 hover:shadow-public-badge"
            >
              <span className="font-public-display text-[20px] leading-[1.25] text-public-ink">
                <span className="block">{card.title}</span>
                <span className="block">por 20 días</span>
              </span>
              <span className="font-public-display text-[44px] leading-none text-public-price md:text-[52px]">
                {card.price}
              </span>
            </li>
          ))}
        </ul>
        <ul className="m-0 flex list-none flex-wrap gap-6 p-0 text-[14px] leading-[1.5] text-public-body">
          {PRICE_NOTES.map((note) => (
            <li key={note.text} className="flex flex-[1_1_220px] items-start gap-3">
              <span className="flex-none text-public-terracotta">
                <Icon name={note.icon} size={24} stroke={1.6} />
              </span>
              <span>{note.text}</span>
            </li>
          ))}
        </ul>
        <div className="self-start">
          <WhatsAppLink href={WHATSAPP_LINKS.hire}>Quiero contratar mi plan</WhatsAppLink>
        </div>
      </div>

      <div
        id="entregas"
        ref={delivery.ref}
        className={`flex min-w-0 flex-[1_1_340px] flex-col gap-[18px] rounded-3xl border border-public-rule bg-public-paper px-8 py-9 ${delivery.className}`}
      >
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 flex-none items-center justify-center rounded-full bg-public-olive text-public-paper">
            <Icon name="truck" size={30} stroke={1.6} />
          </span>
          <SectionHeading className="text-[30px] md:text-[36px]">
            Entregamos en La Paz
          </SectionHeading>
        </div>
        <p className="m-0 text-[16px] leading-[1.6] text-public-body">
          Todos los planes incluyen envío a domicilio en La Paz. Para laderas, consultar costo
          extra. La hora de entrega depende de la zona de tu domicilio.
        </p>
        <div className="self-start">
          <WhatsAppLink href={WHATSAPP_LINKS.deliveryZone} icon="pin">
            Consultar mi zona
          </WhatsAppLink>
        </div>
      </div>
    </section>
  );
}
