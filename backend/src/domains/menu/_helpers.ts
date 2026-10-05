import { addCalendarDays, getCurrentMenuWeek } from '../../utils/date';

// Menus may be planned for the current display week and the one after it.
export const getMenuWindow = (): { start: string; end: string } => {
  const { start } = getCurrentMenuWeek();
  // start is a Monday; +11 calendar days lands on the following week's Friday
  return { start, end: addCalendarDays(start, 11) };
};
