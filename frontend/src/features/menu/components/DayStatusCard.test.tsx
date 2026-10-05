import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Menu } from '@/features/menu/types';
import { emptyDraft } from '@/features/menu/menuFields';
import { DayStatusCard } from './DayStatusCard';

const DATE = '2026-10-05';
const full: Menu = {
  id: '1',
  date: DATE,
  breakfast: 'a',
  morningSnack: 'b',
  salad: 'c',
  lunch: 'd',
  afternoonSnack: 'e',
  dinner: 'f',
  juice: 'g',
};
const partial: Menu = { id: '2', ...emptyDraft(DATE), breakfast: 'Avena', lunch: 'Pollo', dinner: 'Sopa' };

const renderCard = (props: Partial<React.ComponentProps<typeof DayStatusCard>> = {}) =>
  render(<DayStatusCard date={DATE} menu={null} isPast={false} onEdit={jest.fn()} {...props} />);

it('shows the weekday and date', () => {
  renderCard();
  expect(screen.getByText('Lunes')).toBeInTheDocument();
  expect(screen.getByText('5 oct')).toBeInTheDocument();
});

it('reports a day without a menu', () => {
  renderCard();
  expect(screen.getByText('0/7')).toBeInTheDocument();
  expect(screen.getByText('Sin menú')).toBeInTheDocument();
});

it('reports how many meals are missing', () => {
  renderCard({ menu: partial });
  expect(screen.getByText('3/7')).toBeInTheDocument();
  expect(screen.getByText('Faltan 4 tiempos')).toBeInTheDocument();
});

it('reports a complete menu', () => {
  renderCard({ menu: full });
  expect(screen.getByText('7/7')).toBeInTheDocument();
  expect(screen.getByText('Menú completo')).toBeInTheDocument();
});

it('shows the Hoy tag when given', () => {
  renderCard({ tag: 'Hoy' });
  expect(screen.getByText('Hoy')).toBeInTheDocument();
});

it('opens the editor when clicked', async () => {
  const onEdit = jest.fn();
  renderCard({ onEdit });
  await userEvent.click(screen.getByRole('button', { name: 'Editar menú del lunes 5 oct' }));
  expect(onEdit).toHaveBeenCalled();
});

it('cannot be opened for a past day', () => {
  renderCard({ isPast: true });
  expect(screen.getByRole('button', { name: 'Editar menú del lunes 5 oct' })).toBeDisabled();
  expect(screen.getByText('Día pasado')).toBeInTheDocument();
});
