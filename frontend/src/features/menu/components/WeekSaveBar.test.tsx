import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WeekSaveBar } from './WeekSaveBar';

const renderBar = (props: Partial<React.ComponentProps<typeof WeekSaveBar>> = {}) => {
  const handlers = { onDiscard: jest.fn(), onSave: jest.fn() };
  render(<WeekSaveBar changeCount={0} filledCount={14} saving={false} {...handlers} {...props} />);
  return handlers;
};

it('says when there is nothing to save and disables saving', () => {
  renderBar();
  expect(screen.getByText('Sin cambios')).toBeInTheDocument();
  expect(screen.getByText('14 de 35 tiempos cargados')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Guardar semana' })).toBeDisabled();
});

it('counts pending changes', () => {
  renderBar({ changeCount: 1 });
  expect(screen.getByText('1 cambio sin guardar')).toBeInTheDocument();
  renderBar({ changeCount: 5 });
  expect(screen.getByText('5 cambios sin guardar')).toBeInTheDocument();
});

it('saves and discards', async () => {
  const { onSave, onDiscard } = renderBar({ changeCount: 2 });
  await userEvent.click(screen.getByRole('button', { name: 'Guardar semana' }));
  await userEvent.click(screen.getByRole('button', { name: 'Descartar' }));
  expect(onSave).toHaveBeenCalled();
  expect(onDiscard).toHaveBeenCalled();
});

it('locks both actions while saving', () => {
  renderBar({ changeCount: 2, saving: true });
  expect(screen.getByRole('button', { name: /Guardar semana/ })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Descartar' })).toBeDisabled();
});
