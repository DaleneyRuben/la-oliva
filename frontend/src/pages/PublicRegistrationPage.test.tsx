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

  expect(screen.getByRole('heading', { name: 'Cuéntanos un poco sobre ti.' })).toBeInTheDocument();
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
  await user.type(field('weight'), '60');
  await user.type(field('height'), '165');
  await user.selectOptions(field('sex'), 'female');
  await user.type(field('address'), 'Calle de prueba 123');
  await user.selectOptions(field('deliveryZone'), 'Centro');
  await user.type(field('preferredStartDate'), '2026-09-18');

  await user.click(screen.getByRole('button', { name: 'Enviar solicitud' }));

  await waitFor(() =>
    expect(
      screen.getByText('No pudimos enviar tu solicitud. Intenta nuevamente.'),
    ).toBeInTheDocument(),
  );
});
