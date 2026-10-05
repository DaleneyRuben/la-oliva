import { IconButton } from '@ui/IconButton';
import type { WeekDraftEditorProps } from '@/features/menu/types';
import { MEAL_FIELDS, MEAL_FIELD_LABELS, countFilledMeals } from '@/features/menu/menuFields';
import { capitalizedWeekday, dayMonth, isPastDay, weekdayName } from '@/features/menu/menuWeeks';
import { DishTextarea } from './DishTextarea';

const dayLabel = (date: string) => `${weekdayName(date)} ${dayMonth(date)}`;

export function WeekEditGrid({
  weekDays,
  drafts,
  today,
  isChanged,
  onChange,
  onCopyPrevious,
}: WeekDraftEditorProps) {
  return (
    <div
      data-testid="week-edit-grid"
      className="border border-rule rounded-[14px] overflow-hidden bg-paper"
    >
      <div className="overflow-x-auto">
        <table className="w-full border-collapse table-fixed min-w-[940px]">
          <thead>
            <tr>
              <th
                scope="col"
                aria-label="Tipo de comida"
                className="bg-olive-50 border-b border-rule w-[130px]"
              />
              {drafts.map((draft, i) => {
                const past = isPastDay(draft.date, today);
                const isToday = draft.date === today;
                return (
                  <th
                    key={draft.date}
                    scope="col"
                    className={`${isToday ? 'bg-olive-100' : 'bg-olive-50'} border-b border-l border-cream-2 border-b-rule px-3 py-[10px] text-left`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p
                          className={`text-[13px] font-bold ${isToday ? 'text-ok' : 'text-ink-2'}`}
                        >
                          {capitalizedWeekday(draft.date)}
                        </p>
                        <p className="font-mono text-[10.5px] mt-[3px] text-faint">
                          {past
                            ? 'Día pasado'
                            : `${dayMonth(draft.date)} · ${countFilledMeals(draft)}/${MEAL_FIELDS.length}`}
                        </p>
                      </div>
                      {i > 0 && !past && (
                        <IconButton
                          icon="copy"
                          label={`Copiar el ${weekdayName(weekDays[i - 1])} en el ${weekdayName(draft.date)}`}
                          title="Copiar el día anterior"
                          onClick={() => onCopyPrevious(draft.date)}
                          size={15}
                          className="w-8 h-8 shrink-0 rounded-[8px] border border-rule bg-paper text-olive-700 hover:border-olive-700"
                        />
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {MEAL_FIELDS.map((field) => (
              <tr key={field} className="border-t border-cream-2">
                <th
                  scope="row"
                  className="bg-menu-sticky-bg px-4 py-[14px] text-left align-top border-r border-rule"
                >
                  <span className="block font-mono text-[10.5px] tracking-[.08em] uppercase text-muted font-medium">
                    {MEAL_FIELD_LABELS[field]}
                  </span>
                  {field === 'afternoonSnack' && (
                    <span className="block text-[10.5px] text-faint mt-1">fruta</span>
                  )}
                </th>
                {drafts.map((draft) => {
                  const value = draft[field];
                  if (isPastDay(draft.date, today)) {
                    return (
                      <td
                        key={draft.date}
                        className="bg-empty-bg border-l border-cream-2 px-3 py-[11px] align-top text-[12.5px] text-empty-text"
                      >
                        {value || '—'}
                      </td>
                    );
                  }
                  const changed = isChanged(draft.date, field);
                  const filledBg = value ? 'bg-menu-other-filled' : 'bg-menu-today-empty';
                  const bg = changed ? 'bg-warn-bg' : filledBg;
                  return (
                    <td key={draft.date} className={`${bg} border-l border-cream-2 p-0 align-top`}>
                      <DishTextarea
                        id={`dish-${draft.date}-${field}`}
                        label={`${MEAL_FIELD_LABELS[field]} del ${dayLabel(draft.date)}`}
                        value={value}
                        changed={changed}
                        onChange={(v) => onChange(draft.date, field, v)}
                        variant="cell"
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
