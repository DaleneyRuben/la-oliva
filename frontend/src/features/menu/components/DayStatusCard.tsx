import { Button } from '@ui/Button';
import type { Menu } from '@/features/menu/types';
import { MEAL_FIELDS, countFilledMeals } from '@/features/menu/menuFields';
import { capitalizedWeekday, dayMonth, weekdayName } from '@/features/menu/menuWeeks';

interface Props {
  date: string;
  menu: Menu | null;
  tag?: 'Hoy' | 'Mañana';
  isPast: boolean;
  onEdit: () => void;
}

const TOTAL = MEAL_FIELDS.length;

function statusText(count: number, isPast: boolean): string {
  if (isPast) return 'Día pasado';
  if (count === TOTAL) return 'Menú completo';
  if (count === 0) return 'Sin menú';
  return `Faltan ${TOTAL - count} tiempos`;
}

export function DayStatusCard({ date, menu, tag, isPast, onEdit }: Props) {
  const count = countFilledMeals(menu);
  const isToday = tag === 'Hoy';
  const complete = count === TOTAL;

  const surface = isToday
    ? 'bg-gradient-to-br from-today-gradient-start to-today-gradient-end text-olive-50 border-transparent shadow-[var(--shadow-card-elevated)]'
    : `bg-paper text-ink ${count === 0 && !isPast ? 'border-warn-border' : 'border-rule'} hover:border-olive-700`;

  const statusTone = (() => {
    if (isToday) return 'text-today-text';
    if (isPast) return 'text-faint';
    return complete ? 'text-ok' : 'text-warn';
  })();

  return (
    <Button
      variant="bare"
      onClick={onEdit}
      disabled={isPast}
      aria-label={`Editar menú del ${weekdayName(date)} ${dayMonth(date)}`}
      className={`!flex flex-col !items-stretch text-left w-full rounded-[12px] border !px-4 !py-[14px] transition-colors disabled:hover:border-rule ${surface}`}
    >
      <span className="flex items-center justify-between gap-2">
        <span className="text-[13px] font-bold">{capitalizedWeekday(date)}</span>
        {tag && (
          <span
            className={`text-[9.5px] font-bold uppercase tracking-[.14em] rounded-full px-[7px] py-[3px] ${
              isToday ? 'bg-brand-gold text-olive-900' : 'bg-cream-2 text-ink'
            }`}
          >
            {tag}
          </span>
        )}
      </span>
      <span className={`font-mono text-[11px] mt-1 ${isToday ? 'text-today-text' : 'text-faint'}`}>
        {dayMonth(date)}
      </span>
      <span className="flex items-center gap-2 mt-[14px]">
        <span
          className={`flex-1 h-[5px] rounded-full overflow-hidden ${isToday ? 'bg-white/20' : 'bg-progress-track'}`}
        >
          <span
            className={`block h-full rounded-full ${complete && !isToday ? 'bg-olive-700' : 'bg-brand-gold'}`}
            style={{ width: `${(count / TOTAL) * 100}%` }}
          />
        </span>
        <span className="text-[12px] font-semibold tabular-nums">
          {count}/{TOTAL}
        </span>
      </span>
      <span className={`text-[11.5px] font-semibold mt-2 ${statusTone}`}>
        {statusText(count, isPast)}
      </span>
    </Button>
  );
}
