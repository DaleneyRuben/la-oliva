export function RegistrationSuccess() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 pb-20 text-center">
      <span className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-ok-bg font-serif text-[40px] text-brand-primary">
        ✓
      </span>
      <h1 className="mt-7 font-serif text-[31px] leading-none text-ink">Recibimos tu solicitud</h1>
      <p className="mt-4 text-[13px] text-muted">Nos comunicaremos contigo pronto.</p>
    </div>
  );
}
