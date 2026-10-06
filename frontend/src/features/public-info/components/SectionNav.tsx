import { SECTION_LINKS, TONE_BG } from '@/features/public-info/content';
import { PublicInfoIcon } from './PublicInfoIcon';

export function SectionNav() {
  return (
    <nav aria-label="Secciones" className="mx-auto max-w-[1200px] px-6 pb-14 pt-6">
      <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-4 p-0">
        {SECTION_LINKS.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="flex flex-col items-center gap-3.5 rounded-[18px] border border-public-rule bg-public-paper px-4 pb-5 pt-6 text-public-ink no-underline transition hover:-translate-y-0.5 hover:shadow-public-badge"
            >
              <span
                className={`flex h-16 w-16 items-center justify-center rounded-full text-public-paper ${TONE_BG[section.tone]}`}
              >
                <PublicInfoIcon name={section.icon} size={28} />
              </span>
              <span className="font-public-display text-[20px]">{section.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
