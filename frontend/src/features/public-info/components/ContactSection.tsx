import { PublicInfoIcon } from './PublicInfoIcon';
import { SectionHeading } from './SectionHeading';
import { WhatsAppLink } from './WhatsAppLink';

export function ContactSection() {
  return (
    <section
      id="contacto"
      className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-8 px-6 pb-10 pt-[72px]"
    >
      <div className="flex min-w-0 flex-[1_1_360px] flex-col gap-3.5">
        <SectionHeading>¿Tienes alguna consulta?</SectionHeading>
        <p className="m-0 text-[16px] leading-[1.6] text-public-body">
          Cualquier duda estamos para ayudarte con gusto.
        </p>
        <div className="mt-2 self-start">
          <WhatsAppLink>Tengo una consulta</WhatsAppLink>
        </div>
      </div>
      <div className="flex min-w-0 flex-[1_1_360px] flex-col items-center gap-2.5 text-center text-public-terracotta">
        <p className="m-0 -rotate-[6deg] font-public-script text-[48px] leading-none md:text-[56px]">
          Comer bien también es cuidarte
        </p>
        <PublicInfoIcon name="heart" size={36} />
      </div>
    </section>
  );
}
