import { act, renderHook } from '@testing-library/react';
import type { Menu } from '@/features/menu/types';
import { emptyDraft } from '@/features/menu/menuFields';
import { useWeekDraft } from '@/features/menu/hooks/useWeekDraft';

const WEEK = ['2026-10-05', '2026-10-06', '2026-10-07', '2026-10-08', '2026-10-09'];

const MONDAY: Menu = { id: '1', ...emptyDraft('2026-10-05'), breakfast: 'Avena', lunch: 'Pollo' };

const setup = () => renderHook(() => useWeekDraft(WEEK, [MONDAY]));

describe('useWeekDraft', () => {
  it('starts with one draft per weekday, filled from the saved menus', () => {
    const { result } = setup();

    expect(result.current.drafts.map((d) => d.date)).toEqual(WEEK);
    expect(result.current.drafts[0]).toMatchObject({ breakfast: 'Avena', lunch: 'Pollo' });
    expect(result.current.drafts[0]).not.toHaveProperty('id');
    expect(result.current.drafts[1]).toEqual(emptyDraft('2026-10-06'));
    expect(result.current.changeCount).toBe(0);
  });

  it('tracks each edited dish as a change', () => {
    const { result } = setup();

    act(() => result.current.setDish('2026-10-06', 'salad', 'Ensalada rusa'));
    act(() => result.current.setDish('2026-10-05', 'breakfast', 'Panqueques'));

    expect(result.current.drafts[1].salad).toBe('Ensalada rusa');
    expect(result.current.changeCount).toBe(2);
    expect(result.current.isChanged('2026-10-06', 'salad')).toBe(true);
    expect(result.current.isChanged('2026-10-06', 'lunch')).toBe(false);
  });

  it('does not count a dish typed back to its saved value', () => {
    const { result } = setup();

    act(() => result.current.setDish('2026-10-05', 'breakfast', 'Otro'));
    act(() => result.current.setDish('2026-10-05', 'breakfast', 'Avena '));

    expect(result.current.changeCount).toBe(0);
  });

  it('treats an emptied dish as cleared', () => {
    const { result } = setup();

    act(() => result.current.setDish('2026-10-05', 'lunch', ''));

    expect(result.current.changedDrafts).toEqual([
      { ...emptyDraft('2026-10-05'), breakfast: 'Avena', lunch: null },
    ]);
  });

  it('returns only the days that changed', () => {
    const { result } = setup();

    act(() => result.current.setDish('2026-10-08', 'dinner', 'Sopa'));

    expect(result.current.changedDrafts).toEqual([{ ...emptyDraft('2026-10-08'), dinner: 'Sopa' }]);
  });

  it('copies the previous day into a day', () => {
    const { result } = setup();

    act(() => result.current.copyPreviousDay('2026-10-06'));

    expect(result.current.drafts[1]).toEqual({
      ...emptyDraft('2026-10-06'),
      breakfast: 'Avena',
      lunch: 'Pollo',
    });
    expect(result.current.changeCount).toBe(2);
  });

  it('reset discards every change', () => {
    const { result } = setup();

    act(() => result.current.setDish('2026-10-07', 'juice', 'Limonada'));
    act(() => result.current.reset());

    expect(result.current.changeCount).toBe(0);
    expect(result.current.drafts[2].juice).toBeNull();
  });
});
