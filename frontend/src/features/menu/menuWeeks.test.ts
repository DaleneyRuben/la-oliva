import { getMenuWeeks, isPastDay } from '@/features/menu/menuWeeks';

describe('getMenuWeeks', () => {
  it('returns this week and next week, Monday to Friday', () => {
    // Wednesday 7 Oct 2026
    expect(getMenuWeeks(new Date(2026, 9, 7))).toEqual([
      ['2026-10-05', '2026-10-06', '2026-10-07', '2026-10-08', '2026-10-09'],
      ['2026-10-12', '2026-10-13', '2026-10-14', '2026-10-15', '2026-10-16'],
    ]);
  });

  it('keeps the ending week on Saturday', () => {
    expect(getMenuWeeks(new Date(2026, 9, 10))[0][0]).toBe('2026-10-05');
  });

  it('starts from the upcoming week on Sunday', () => {
    expect(getMenuWeeks(new Date(2026, 9, 11))).toEqual([
      ['2026-10-12', '2026-10-13', '2026-10-14', '2026-10-15', '2026-10-16'],
      ['2026-10-19', '2026-10-20', '2026-10-21', '2026-10-22', '2026-10-23'],
    ]);
  });
});

describe('isPastDay', () => {
  it('is true only for days before today', () => {
    expect(isPastDay('2026-10-06', '2026-10-07')).toBe(true);
    expect(isPastDay('2026-10-07', '2026-10-07')).toBe(false);
    expect(isPastDay('2026-10-08', '2026-10-07')).toBe(false);
  });
});
