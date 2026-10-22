import { Icon } from '@ui/Icon';
import { initials } from '@/utils/string';
import type { DeliveryPerson } from '@/features/delivery/types';

interface Props {
  person: DeliveryPerson;
  avatarClass: string;
  rowBorderClass: string;
  showAddress?: boolean;
  showExternalDeliveryTag?: boolean;
}

export function DeliveryPersonRow({
  person,
  avatarClass,
  rowBorderClass,
  showAddress = false,
  showExternalDeliveryTag = true,
}: Props) {
  const phoneLink = (placement: string) => (
    <a
      href={`tel:${person.phone.replace(/\s/g, '')}`}
      className={`items-center gap-[5px] font-mono text-[11.5px] tracking-[.02em] text-muted no-underline hover:text-olive-700 transition-colors whitespace-nowrap ${placement}`}
    >
      <Icon name="phone" size={11} />
      {person.phone}
    </a>
  );

  return (
    <div
      className={`flex items-start sm:items-center gap-[11px] py-[9px] border-t ${rowBorderClass}`}
    >
      <div
        className={`w-7 h-7 rounded-full border flex items-center justify-center font-mono font-semibold text-[10px] shrink-0 ${avatarClass}`}
      >
        {initials(person.name)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-[13.5px] font-semibold text-ink leading-tight">{person.name}</p>
          {person.isNew && (
            <span className="font-mono text-[9px] font-bold tracking-[.1em] uppercase text-white bg-olive-700 rounded-full px-2 py-0.5 shrink-0">
              Nuevo
            </span>
          )}
          {showExternalDeliveryTag && person.delivery === 'Otro' && (
            <span className="font-mono text-[9px] font-bold tracking-[.06em] text-warn-text bg-warn-bg border border-warn-border rounded-full px-2 py-0.5 shrink-0">
              Entrega fuera de La Oliva
            </span>
          )}
        </div>
        {showAddress ? (
          <>
            <div className="flex items-start gap-[6px] text-faint mt-0.5">
              <Icon name="pin" size={12} className="shrink-0 mt-px" />
              <span className="font-mono text-[11px] tracking-[.01em] leading-[1.35] text-muted">
                {person.address}
              </span>
            </div>
            {/* On a phone the address needs the row's full width, so the number moves under it. */}
            {phoneLink('inline-flex mt-[3px] sm:hidden')}
          </>
        ) : (
          phoneLink('inline-flex mt-0.5')
        )}
      </div>
      {showAddress && phoneLink('hidden sm:inline-flex')}
    </div>
  );
}
