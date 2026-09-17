export function RegistrationStepHeading({ title }: { title: string }) {
  return (
    <>
      <p className="text-[10px] font-medium uppercase tracking-[0.17em] text-brand-primary md:hidden">
        {title}
      </p>
      <h2 className="hidden font-serif text-[31px] leading-none text-ink md:block">{title}</h2>
    </>
  );
}
