import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { emptyDraft } from '@/features/menu/menuFields';
import { WeekEditGrid } from './WeekEditGrid';

const WEEK = ['2026-10-05', '2026-10-06', '2026-10-07', '2026-10-08', '2026-10-09'];
const drafts = WEEK.map((date) => emptyDraft(date));
drafts[0] = { ...drafts[0], breakfast: 'Avena' };
drafts[2] = { ...drafts[2], lunch: 'Pollo al horno' };

const renderGrid = (props: Partial<React.ComponentProps<typeof WeekEditGrid>> = {}) => {
  const handlers = { onChange: jest.fn(), onCopyPrevious: jest.fn() };
  render(
    <WeekEditGrid
      weekDays={WEEK}
      drafts={drafts}
      today="2026-10-07"
      isChanged={() => false}
      {...handlers}
      {...props}
    />,
  );
  return handlers;
};

it('renders an editable box for every meal of today and later', () => {
  renderGrid();
  // Wed, Thu, Fri × 7 meals
  expect(screen.getAllByRole('textbox')).toHaveLength(21);
  expect(screen.getByRole('textbox', { name: 'Almuerzo del miércoles 7 oct' })).toHaveValue(
    'Pollo al horno',
  );
});

it('locks the days before today', () => {
  renderGrid();
  expect(
    screen.queryByRole('textbox', { name: 'Desayuno del lunes 5 oct' }),
  ).not.toBeInTheDocument();
  expect(screen.getByText('Avena')).toBeInTheDocument();
  expect(screen.getAllByText('Día pasado')).toHaveLength(2);
});

it('reports each keystroke with the day and meal', async () => {
  const { onChange } = renderGrid();
  await userEvent.type(screen.getByRole('textbox', { name: 'Cena del jueves 8 oct' }), 'S');
  expect(onChange).toHaveBeenCalledWith('2026-10-08', 'dinner', 'S');
});

it('copies the previous day into an editable day', async () => {
  const { onCopyPrevious } = renderGrid();
  await userEvent.click(screen.getByRole('button', { name: 'Copiar el miércoles en el jueves' }));
  expect(onCopyPrevious).toHaveBeenCalledWith('2026-10-08');
});

it('offers no copy into a locked day', () => {
  renderGrid();
  expect(
    screen.queryByRole('button', { name: 'Copiar el lunes en el martes' }),
  ).not.toBeInTheDocument();
});

it('marks the cells that changed', () => {
  renderGrid({ isChanged: (date, field) => date === '2026-10-09' && field === 'juice' });
  expect(screen.getByRole('textbox', { name: 'Jugo del viernes 9 oct' })).toHaveAttribute(
    'data-changed',
    'true',
  );
  expect(screen.getByRole('textbox', { name: 'Cena del viernes 9 oct' })).toHaveAttribute(
    'data-changed',
    'false',
  );
});
