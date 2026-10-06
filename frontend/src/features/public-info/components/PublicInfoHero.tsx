import heroPhoto from '@/assets/public-info/hero.jpg';
import { WhatsAppLink } from './WhatsAppLink';

export function PublicInfoHero() {
  return (
    <section
      id="inicio"
      className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-10 px-6 pb-10 pt-14"
    >
      <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-[22px]">
        <p className="m-0 font-public-script text-[30px] leading-none text-public-muted md:text-[34px]">
          Más que catering, experiencias que dejan huella.
        </p>
        <h1 className="m-0 font-public-display text-[48px] font-medium leading-[1.02] tracking-[-0.01em] text-public-ink md:text-[64px]">
          Comer bien puede ser mucho{' '}
          <em className="font-public-script text-[1.25em] font-normal not-italic text-public-terracotta">
            más fácil
          </em>
        </h1>
        <p className="m-0 max-w-[520px] text-[17px] leading-[1.6] text-public-body">
          Comidas caseras, deliciosas y equilibradas, preparadas para acompañarte durante tu día,
          sin que tengas que preocuparte por cocinar o planificar cada comida.
        </p>
        <div className="mt-1.5">
          <WhatsAppLink>Quiero contratar</WhatsAppLink>
        </div>
      </div>

      <div className="relative flex min-w-0 flex-[1_1_420px] flex-col items-center gap-[18px] pt-16 md:pt-0">
        <p className="absolute left-0 top-0 m-0 max-w-[200px] text-[11px] font-semibold uppercase leading-[1.8] tracking-[0.22em] text-public-olive">
          Sabores que reúnen, momentos que perduran.
        </p>
        <img
          src={heroPhoto}
          alt="Porciones de comida casera en envases listos para entregar"
          className="block h-auto w-full max-w-[400px] rounded-t-[200px] rounded-b-[32px]"
        />
        <p className="m-0 self-end pr-[8%] font-public-script text-[36px] leading-none text-public-terracotta">
          Con altura, siempre.
        </p>
        <div className="absolute bottom-10 left-[2%] box-border flex h-[196px] w-[196px] flex-col items-center justify-center rounded-full border border-public-rule bg-public-paper p-[18px] text-center shadow-public-badge">
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-public-muted">
            Planes desde
          </span>
          <span className="mt-1.5 font-public-display text-[40px] leading-none text-public-terracotta">
            Bs. 1.450
          </span>
          <span className="mt-1.5 text-[13px] text-public-body">por 20 días</span>
        </div>
      </div>
    </section>
  );
}
