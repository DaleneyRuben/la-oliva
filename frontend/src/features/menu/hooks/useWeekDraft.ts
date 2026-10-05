import { useMemo, useState } from 'react';
import type { Menu, MenuDraft } from '@/features/menu/types';
import { MEAL_FIELDS, emptyDraft, type MealField } from '@/features/menu/menuFields';

const toDraft = (date: string, menus: Menu[]): MenuDraft => {
  const menu = menus.find((m) => m.date === date);
  const draft = emptyDraft(date);
  MEAL_FIELDS.forEach((field) => {
    draft[field] = menu?.[field] ?? null;
  });
  return draft;
};

// Trailing spaces and an emptied box are not real edits.
const clean = (value: string | null): string | null => value?.trim() || null;

export function useWeekDraft(weekDays: string[], menus: Menu[]) {
  const saved = useMemo(() => weekDays.map((date) => toDraft(date, menus)), [weekDays, menus]);
  const [drafts, setDrafts] = useState<MenuDraft[]>(saved);

  const isChanged = (date: string, field: MealField): boolean => {
    const i = weekDays.indexOf(date);
    return clean(drafts[i][field]) !== clean(saved[i][field]);
  };

  const setDish = (date: string, field: MealField, value: string) =>
    setDrafts((prev) => prev.map((d) => (d.date === date ? { ...d, [field]: value } : d)));

  const copyPreviousDay = (date: string) =>
    setDrafts((prev) => {
      const i = weekDays.indexOf(date);
      return prev.map((d, j) => (j === i ? { ...prev[i - 1], date } : d));
    });

  const changed = weekDays.flatMap((date) =>
    MEAL_FIELDS.filter((field) => isChanged(date, field)).map((field) => ({ date, field })),
  );

  const changedDrafts = drafts
    .filter((d) => changed.some((c) => c.date === d.date))
    .map((d) => {
      const cleaned = { ...d };
      MEAL_FIELDS.forEach((field) => {
        cleaned[field] = clean(d[field]);
      });
      return cleaned;
    });

  return {
    drafts,
    setDish,
    copyPreviousDay,
    reset: () => setDrafts(saved),
    isChanged,
    changeCount: changed.length,
    changedDrafts,
  };
}
