import { Icon } from '@ui/Icon';
import { DeliveryGroupCard } from '@/features/delivery/components/DeliveryGroupCard';
import { DeliveryPersonRow } from '@/features/delivery/components/DeliveryPersonRow';
import type { DeliveryShiftRun, DeliveryZone } from '@/features/delivery/types';

interface Props {
  zone: DeliveryZone;
  shift: DeliveryShiftRun;
}

// A zone is a sub-heading inside its run's card, so it takes the run's colour rather than
// standing out as a heading of its own.
const TONE: Record<DeliveryShiftRun, { icon: string; label: string; rule: string }> = {
  day: {
    icon: 'text-delivery-2-accent',
    label: 'text-delivery-2-chip-text',
    rule: 'bg-delivery-2-card-border',
  },
  night: { icon: 'text-olive-700', label: 'text-olive-800', rule: 'bg-hairline' },
};

export function DeliveryZoneSection({ zone, shift }: Props) {
  const tone = TONE[shift];

  return (
    <section className="flex flex-col">
      <div className="flex items-center gap-2 mt-4 mb-1">
        <Icon name="pin" size={13} stroke={2} className={`shrink-0 ${tone.icon}`} />
        <h3 className={`text-[11px] font-bold tracking-[.14em] uppercase ${tone.label}`}>
          Zona {zone.zone}
        </h3>
        <span className="text-[11px] text-muted">
          · <span>{zone.deliveryCount === 1 ? '1 entrega' : `${zone.deliveryCount} entregas`}</span>
        </span>
        <span className={`h-px flex-1 ${tone.rule}`} />
      </div>

      {zone.groups.map((g) => (
        <div key={g.groupToken} className="my-[6px]">
          <DeliveryGroupCard group={g} shift={shift} />
        </div>
      ))}

      {zone.singles.map((p) => (
        <DeliveryPersonRow
          key={p.id}
          person={p}
          avatarClass="bg-cream-2 border-hairline text-muted"
          rowBorderClass="border-hairline"
          showAddress
        />
      ))}
    </section>
  );
}
