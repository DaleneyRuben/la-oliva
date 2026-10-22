import { Icon } from '@ui/Icon';
import { DeliveryPersonRow } from '@/features/delivery/components/DeliveryPersonRow';
import type { DeliveryGroup, DeliveryShiftRun } from '@/features/delivery/types';

// A group takes the colours of the run it sits in, so a stop never reads as belonging to the
// other shift. Tailwind scans source files for complete class-name literals, so every class is
// spelled out in full here.
const GROUP_PALETTE: Record<
  DeliveryShiftRun,
  { card: string; icon: string; label: string; chip: string; avatar: string; rowBorder: string }
> = {
  day: {
    card: 'bg-delivery-2-card-bg border border-delivery-2-card-border',
    icon: 'text-delivery-2-accent',
    label: 'text-delivery-2-chip-text',
    chip: 'bg-delivery-2-chip-bg text-delivery-2-chip-text',
    avatar: 'bg-delivery-2-chip-bg border-delivery-2-avatar-border text-delivery-2-chip-text',
    rowBorder: 'border-delivery-2-card-border',
  },
  night: {
    card: 'bg-delivery-1-card-bg border border-delivery-1-card-border',
    icon: 'text-delivery-1-accent',
    label: 'text-delivery-1-chip-text',
    chip: 'bg-delivery-1-chip-bg text-delivery-1-chip-text',
    avatar: 'bg-delivery-1-chip-bg border-delivery-1-avatar-border text-delivery-1-chip-text',
    rowBorder: 'border-delivery-1-card-border',
  },
};

interface Props {
  group: DeliveryGroup;
  shift: DeliveryShiftRun;
}

export function DeliveryGroupCard({ group, shift }: Props) {
  const c = GROUP_PALETTE[shift];
  const isOutsideLaOliva = group.members.some((member) => member.delivery === 'Otro');

  return (
    <div className={`rounded-[10px] px-3 pt-[10px] pb-[2px] flex flex-col gap-[6px] ${c.card}`}>
      <div className="flex items-center gap-[9px]">
        <Icon name="users" size={16} className={c.icon} />
        <span
          className={`font-mono text-[10.5px] font-semibold tracking-[.1em] uppercase flex-1 min-w-0 ${c.label}`}
        >
          Entrega conjunta
        </span>
        {isOutsideLaOliva && (
          <span className="font-mono text-[9px] font-bold tracking-[.06em] text-warn-text bg-warn-bg border border-warn-border rounded-full px-2 py-0.5 shrink-0">
            Entrega fuera de La Oliva
          </span>
        )}
        <span
          className={`font-mono text-[10px] font-semibold tracking-[.05em] rounded-full px-[9px] py-[3px] whitespace-nowrap ${c.chip}`}
        >
          {group.members.length} clientes
        </span>
      </div>
      {group.members[0] && (
        <div className={`flex items-start gap-2 ${c.label}`}>
          <Icon name="pin" size={14} className="shrink-0 mt-px" />
          <span className="font-mono text-[11.5px] font-medium tracking-[.01em] leading-[1.35] text-ink-2">
            {group.members[0].address}
          </span>
        </div>
      )}
      <div className="flex flex-col">
        {group.members.map((m) => (
          <DeliveryPersonRow
            key={m.id}
            person={m}
            avatarClass={c.avatar}
            rowBorderClass={c.rowBorder}
            showExternalDeliveryTag={false}
          />
        ))}
      </div>
    </div>
  );
}
