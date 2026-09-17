import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { PublicRegistrationPage } from './PublicRegistrationPage';

it('shows the public registration heading', () => {
  render(
    <MemoryRouter>
      <PublicRegistrationPage />
    </MemoryRouter>,
  );

  expect(screen.getByRole('heading', { name: 'Datos personales' })).toBeInTheDocument();
  expect(screen.getByText('Paso 1 de 3')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Continuar' })).toBeInTheDocument();
  expect(screen.getAllByRole('listitem')[0]).toHaveAttribute('aria-current', 'step');
  expect(screen.getByRole('main')).toHaveClass('md:items-center');
  expect(screen.getByRole('main').firstElementChild).toHaveClass('md:h-[calc(100vh-48px)]');
  expect(screen.queryByText('Formulario')).not.toBeInTheDocument();
  expect(screen.queryByText('Confirmación')).not.toBeInTheDocument();
});

it('shows a retry message when submitting the form fails due to a network error', async () => {
  const user = userEvent.setup();
  global.fetch = jest.fn().mockRejectedValue(new TypeError('Failed to fetch'));

  render(
    <MemoryRouter>
      <PublicRegistrationPage />
    </MemoryRouter>,
  );

  const field = (id: string) => document.getElementById(id) as HTMLInputElement;
  await user.type(field('firstName'), 'María');
  await user.type(field('lastName'), 'Prueba');
  await user.type(field('dateOfBirth'), '1990-01-01');
  await user.type(field('phoneNumber'), '70000001');
  await user.selectOptions(field('sex'), 'female');
  await user.type(field('address'), 'Calle de prueba 123');
  await user.type(field('preferredStartDate'), '2026-09-18');
  await user.click(screen.getByRole('button', { name: 'Centro' }));
  await user.click(screen.getByRole('button', { name: 'Continuar' }));

  await screen.findByRole('heading', { name: 'Tu salud' });
  await user.type(field('weight'), '60');
  await user.type(field('height'), '165');
  await user.click(screen.getByRole('button', { name: 'Continuar' }));

  await screen.findByRole('heading', { name: 'Revisa tus datos' });

  await user.click(screen.getByRole('button', { name: 'Enviar solicitud' }));

  await waitFor(() =>
    expect(
      screen.getByText('No pudimos enviar tu solicitud. Intenta nuevamente.'),
    ).toBeInTheDocument(),
  );
});
