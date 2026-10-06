const VALUES = ['Sabor', 'Calidad', 'Experiencia'];

export function PublicInfoFooter() {
  return (
    <footer className="border-t border-public-rule">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-[18px] px-6 pb-[72px] pt-8">
        <p className="m-0 flex flex-wrap items-center gap-3.5 font-public-display text-[22px] text-public-ink">
          <span>La Oliva Catering</span>
          <span aria-hidden="true" className="inline-block h-5 w-px bg-public-terracotta" />
          <span>Catering con altura</span>
        </p>
        <ul className="m-0 flex list-none items-center gap-3.5 p-0 text-[11px] font-semibold uppercase tracking-[0.22em] text-public-muted">
          {VALUES.map((value, index) => (
            <li key={value} className="flex items-center gap-3.5">
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className="inline-block h-1 w-1 rounded-full bg-public-terracotta"
                />
              )}
              {value}
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
