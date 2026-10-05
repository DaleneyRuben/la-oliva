import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { emptyDraft } from '@/features/menu/menuFields';
import { MobileWeekEditor } from './MobileWeekEditor';

const WEEK = ['2026-10-05', '2026-10-06', '2026-10-07', '2026-10-08', '2026-10-09'];
const drafts = WEEK.map((date) => emptyDraft(date));
drafts[2] = { ...drafts[2], lunch: 'Pollo al horno' };

const renderEditor = () => {
  const handlers = { onChange: jest.fn(), onCopyPrevious: jest.fn() };
  render(
    <MobileWeekEditor
      weekDays={WEEK}
      drafts={drafts}
      today="2026-10-07"
      isChanged={() => false}
      {...handlers}
    />,
  );
  return handlers;
};

it('opens on today and shows its seven meals', () => {
  renderEditor();
  expect(screen.getByRole('tab', { name: /Mié/ })).toHaveAttribute('aria-selected', 'true');
  expect(screen.getAllByRole('textbox')).toHaveLength(7);
  expect(screen.getByRole('textbox', { name: 'Almuerzo' })).toHaveValue('Pollo al horno');
});

it('switches to another day', async () => {
  const { onChange } = renderEditor();
  await userEvent.click(screen.getByRole('tab', { name: /Vie/ }));
  await userEvent.type(screen.getByRole('textbox', { name: 'Jugo' }), 'L');
  expect(onChange).toHaveBeenCalledWith('2026-10-09', 'juice', 'L');
});

it('shows a past day read only', async () => {
  renderEditor();
  await userEvent.click(screen.getByRole('tab', { name: /Lun/ }));
  expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  expect(screen.getByText('Día pasado')).toBeInTheDocument();
});

it('copies the previous day', async () => {
  const { onCopyPrevious } = renderEditor();
  await userEvent.click(screen.getByRole('button', { name: 'Copiar día anterior' }));
  expect(onCopyPrevious).toHaveBeenCalledWith('2026-10-07');
});
