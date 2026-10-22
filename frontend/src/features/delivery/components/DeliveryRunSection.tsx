import { Icon } from '@ui/Icon';
import { DeliveryZoneSection } from '@/features/delivery/components/DeliveryZoneSection';
import type { DeliveryRun, DeliveryShiftRun } from '@/features/delivery/types';
import { formatWeekdayDay } from '@/utils/format';

interface Props {
  shift: DeliveryShiftRun;
  run: DeliveryRun;
}

const COPY: Record<DeliveryShiftRun, { title: string; when: string; empty: string; icon: string }> =
  {
    day: { title: 'Turno día', when: 'en la mañana', empty: 'Sin entregas de día.', icon: 'sun' },
    night: {
      title: 'Turno noche',
      when: 'en la noche',
      empty: 'Sin entregas de noche.',
      icon: 'moon',
    },
  };

// Each run is its own card: day in the gold family, night under a dark olive header, so the
// driver can tell the two lists apart at a glance in either theme.
const STYLE: Record<
  DeliveryShiftRun,
  {
    card: string;
    header: string;
    tile: string;
    title: string;
    sub: string;
    pill: string;
    emptyBorder: string;
    emptyText: string;
  }
> = {
  day: {
    card: 'border-delivery-2-card-border',
    header: 'bg-delivery-2-chip-bg border-b border-delivery-2-card-border',
    tile: 'bg-paper text-delivery-2-accent',
    title: 'text-olive-900',
    sub: 'text-delivery-2-chip-text',
    pill: 'bg-paper text-delivery-2-chip-text border border-delivery-2-card-border',
    emptyBorder: 'border-delivery-2-card-border',
    emptyText: 'text-delivery-2-chip-text',
  },
  night: {
    card: 'border-rule',
    header: 'bg-olive-900',
    tile: 'bg-olive-800 text-delivery-2-chip-bg',
    title: 'text-paper',
    sub: 'text-cream-2',
    pill: 'bg-olive-800 text-cream-2',
    emptyBorder: 'border-rule',
    emptyText: 'text-ink-2',
  },
};

const stopCount = (run: DeliveryRun) => run.zones.reduce((sum, z) => sum + z.deliveryCount, 0);

export function DeliveryRunSection({ shift, run }: Props) {
  const copy = COPY[shift];
  const style = STYLE[shift];
  const headingId = `delivery-run-${shift}`;
  const count = stopCount(run);

  if (run.zones.length === 0) {
    return (
      <section
        aria-labelledby={headingId}
        className={`flex items-center gap-3 bg-paper border border-dashed rounded-2xl px-4 py-3 lg:px-5 ${style.emptyBorder}`}
      >
        <span
          className={`w-8 h-8 rounded-[9px] flex items-center justify-center shrink-0 ${
            shift === 'day' ? 'bg-delivery-2-chip-bg text-delivery-2-accent' : style.tile
          }`}
        >
          <Icon name={copy.icon} size={17} stroke={1.8} />
        </span>
        <div>
          <h2
            id={headingId}
            className="font-serif font-semibold text-[17px] lg:text-[19px] text-olive-900"
          >
            {copy.title}
          </h2>
          <p className={`text-[12px] ${style.emptyText}`}>{copy.empty}</p>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-labelledby={headingId}
      className={`bg-paper border rounded-2xl overflow-hidden ${style.card}`}
    >
      <header
        className={`flex items-center gap-3 px-[14px] py-3 lg:px-5 lg:py-[14px] ${style.header}`}
      >
        <span
          className={`w-[34px] h-[34px] rounded-[10px] flex items-center justify-center shrink-0 ${style.tile}`}
        >
          <Icon name={copy.icon} size={18} stroke={1.8} />
        </span>
        <div className="flex-1 min-w-0">
          <h2
            id={headingId}
            className={`font-serif font-semibold text-[19px] lg:text-[21px] leading-tight ${style.title}`}
          >
            {copy.title}
          </h2>
          <p className={`text-[12px] mt-px ${style.sub}`}>
            Reparto {copy.when} · comidas del{' '}
            <span className="font-semibold">{formatWeekdayDay(run.mealDate)}</span>
          </p>
        </div>
        <span
          className={`text-[11px] font-semibold rounded-full px-[10px] py-1 whitespace-nowrap ${style.pill}`}
        >
          {count} {count === 1 ? 'entrega' : 'entregas'}
        </span>
      </header>
      <div className="px-[14px] pb-[10px] lg:px-5 lg:pb-[14px]">
        {run.zones.map((zone) => (
          <DeliveryZoneSection key={zone.zone} zone={zone} shift={shift} />
        ))}
      </div>
    </section>
  );
}
