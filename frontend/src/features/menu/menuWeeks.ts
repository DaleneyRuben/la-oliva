import { addDays, addWeeks, format, getDay, isBefore, parseISO, startOfISOWeek } from 'date-fns';
import { es } from 'date-fns/locale';

const toIso = (d: Date) => format(d, 'yyyy-MM-dd');

// Same display week as the backend: on Sunday it already shows the upcoming week.
export function getMenuWeeks(today: Date): string[][] {
  const monday = getDay(today) === 0 ? addDays(today, 1) : startOfISOWeek(today);
  return [0, 1].map((week) =>
    [0, 1, 2, 3, 4].map((day) => toIso(addDays(addWeeks(monday, week), day))),
  );
}

export const isPastDay = (date: string, today: string): boolean =>
  isBefore(parseISO(date), parseISO(today));

export const weekdayName = (date: string): string => format(parseISO(date), 'EEEE', { locale: es });

export const capitalizedWeekday = (date: string): string => {
  const name = weekdayName(date);
  return name.charAt(0).toUpperCase() + name.slice(1);
};

export const dayMonth = (date: string): string => format(parseISO(date), 'd MMM', { locale: es });

export const weekRangeLabel = (weekDays: string[]): string =>
  `${format(parseISO(weekDays[0]), 'd')} – ${dayMonth(weekDays[weekDays.length - 1])}`;
