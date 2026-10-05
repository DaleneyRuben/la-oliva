import { useState } from 'react';
import { Button } from '@ui/Button';
import type { WeekDraftEditorProps } from '@/features/menu/types';
import { MEAL_FIELDS, MEAL_FIELD_LABELS, countFilledMeals } from '@/features/menu/menuFields';
import { capitalizedWeekday, dayMonth, isPastDay } from '@/features/menu/menuWeeks';
import { DishTextarea } from './DishTextarea';

const firstEditableIndex = (weekDays: string[], today: string) =>
  Math.max(
    0,
    weekDays.findIndex((date) => !isPastDay(date, today)),
  );

function dotCls(count: number, selected: boolean): string {
  if (count === MEAL_FIELDS.length) return selected ? 'bg-olive-50' : 'bg-olive-700';
  if (count === 0) return 'border border-warn-dot';
  return 'bg-warn-dot';
}

export function MobileWeekEditor({
  weekDays,
  drafts,
  today,
  isChanged,
  onChange,
  onCopyPrevious,
}: WeekDraftEditorProps) {
  const [selected, setSelected] = useState(() => firstEditableIndex(weekDays, today));
  const draft = drafts[selected];
  const past = isPastDay(draft.date, today);

  return (
    <div data-testid="mobile-week-editor">
      <div role="tablist" aria-label="Día" className="grid grid-cols-5 gap-[6px] mb-4">
        {drafts.map((d, i) => {
          const isSelected = i === selected;
          return (
            <Button
              key={d.date}
              variant="bare"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setSelected(i)}
              className={`!flex-col !gap-[2px] !px-0 !py-[7px] rounded-[10px] border ${
                isSelected
                  ? 'bg-brand-primary text-brand-on-primary border-brand-primary-hover'
                  : 'bg-paper text-ink border-rule'
              }`}
            >
              <span className="text-[12px] font-bold">
                {capitalizedWeekday(d.date).slice(0, 3)}
              </span>
              <span className="text-[10.5px]">{dayMonth(d.date).split(' ')[0]}</span>
              <span
                aria-hidden="true"
                className={`w-[6px] h-[6px] rounded-full mt-[3px] ${dotCls(countFilledMeals(d), isSelected)}`}
              />
            </Button>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-3 mb-3">
        <p className="font-serif font-semibold text-[20px] text-ink">
          {capitalizedWeekday(draft.date)} {dayMonth(draft.date)}
        </p>
        {past ? (
          <span className="text-[12px] font-semibold text-faint">Día pasado</span>
        ) : (
          selected > 0 && (
            <Button
              variant="ghost"
              size="sm"
              leftIcon="copy"
              onClick={() => onCopyPrevious(draft.date)}
            >
              Copiar día anterior
            </Button>
          )
        )}
      </div>

      <div className="flex flex-col gap-[10px]">
        {MEAL_FIELDS.map((field) => (
          <div key={field}>
            <p className="font-mono text-[10px] tracking-[.12em] uppercase text-muted font-semibold mb-[6px]">
              {MEAL_FIELD_LABELS[field]}
            </p>
            {past ? (
              <p className="text-[14px] text-empty-text px-[14px] py-[11px] rounded-[9px] bg-empty-bg">
                {draft[field] || '—'}
              </p>
            ) : (
              <DishTextarea
                id={`mobile-dish-${draft.date}-${field}`}
                label={MEAL_FIELD_LABELS[field]}
                value={draft[field]}
                changed={isChanged(draft.date, field)}
                onChange={(v) => onChange(draft.date, field, v)}
                variant="field"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
