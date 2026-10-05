import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Menu } from '@/features/menu/types';
import { emptyDraft } from '@/features/menu/menuFields';
import { WeekEditor } from './WeekEditor';

const WEEK = ['2026-10-05', '2026-10-06', '2026-10-07', '2026-10-08', '2026-10-09'];
const menus: Menu[] = [{ id: '1', ...emptyDraft('2026-10-07'), lunch: 'Pollo' }];

const renderEditor = () => {
  const props = { onSave: jest.fn().mockResolvedValue(undefined), onClose: jest.fn() };
  render(
    <WeekEditor weekDays={WEEK} menus={menus} today="2026-10-07" isSaving={false} {...props} />,
  );
  return props;
};

const desktop = () => within(screen.getByTestId('week-edit-grid'));

it('saves only the changed days and closes', async () => {
  const { onSave, onClose } = renderEditor();

  await userEvent.type(desktop().getByRole('textbox', { name: 'Cena del jueves 8 oct' }), 'Sopa');
  expect(screen.getByText('1 cambio sin guardar')).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: 'Guardar semana' }));

  expect(onSave).toHaveBeenCalledWith([{ ...emptyDraft('2026-10-08'), dinner: 'Sopa' }]);
  expect(onClose).toHaveBeenCalled();
});

it('closes right away when nothing changed', async () => {
  const { onClose } = renderEditor();
  await userEvent.click(screen.getByRole('button', { name: 'Descartar' }));
  expect(onClose).toHaveBeenCalled();
});

it('asks before discarding unsaved changes', async () => {
  const { onClose } = renderEditor();
  await userEvent.type(desktop().getByRole('textbox', { name: 'Jugo del viernes 9 oct' }), 'L');

  await userEvent.click(screen.getByRole('button', { name: 'Descartar' }));
  expect(onClose).not.toHaveBeenCalled();
  await userEvent.click(screen.getByRole('button', { name: 'Descartar cambios' }));

  expect(onClose).toHaveBeenCalled();
});

it('warns before leaving the page with unsaved changes', async () => {
  renderEditor();
  await userEvent.type(desktop().getByRole('textbox', { name: 'Jugo del viernes 9 oct' }), 'L');

  const event = new Event('beforeunload', { cancelable: true });
  window.dispatchEvent(event);

  expect(event.defaultPrevented).toBe(true);
});
