import { ReactNode } from 'react';

function BrandHeader() {
  return (
    <header className="bg-brand-primary px-6 py-5 text-brand-on-primary md:bg-transparent md:px-0 md:py-0">
      <p className="brand-oliva text-[44px] leading-none">La Oliva</p>
      <p className="mt-3 text-[9px] font-medium uppercase tracking-[0.22em] text-brand-on-primary/90">
        Catering · con altura
      </p>
    </header>
  );
}

export function RegistrationShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[#171717] px-0 py-0 md:flex md:items-center md:justify-center md:bg-cream">
      <div className="mx-auto flex min-h-screen max-w-[430px] overflow-hidden rounded-[24px] border border-rule bg-paper md:h-[min(708px,100vh)] md:min-h-0 md:max-w-[918px] md:rounded-[24px]">
        <aside className="hidden w-[40%] flex-col justify-between bg-brand-primary p-[44px] text-brand-on-primary md:flex">
          <BrandHeader />
          <div>
            <h1 className="max-w-[360px] font-serif text-[42px] leading-[1.05]">
              Comencemos a cuidar de ti
            </h1>
            <p className="mt-5 text-[14px] text-brand-on-primary/90">Cuéntanos un poco sobre ti.</p>
          </div>
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-brand-on-primary/80">
            Tu bienestar, a tu ritmo
          </p>
        </aside>

        <section className="flex min-h-screen w-full flex-col md:min-h-0 md:w-[60%] md:overflow-y-auto">
          <div className="md:hidden">
            <BrandHeader />
          </div>
          {children}
        </section>
      </div>
    </main>
  );
}

export function RegistrationMobileIntro() {
  return (
    <div className="md:hidden">
      <h1 className="font-serif text-[30px] leading-none text-ink">Comencemos a cuidar de ti</h1>
      <p className="mt-3 text-[13px] text-muted">Cuéntanos un poco sobre ti.</p>
    </div>
  );
}
