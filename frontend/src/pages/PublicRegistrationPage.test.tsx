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
  expect(screen.getByRole('button', { name: 'Continuar' })).toHaveStyle({
    fontSize: '12px',
    padding: '10.5px 17.5px',
  });
  expect(screen.getAllByRole('listitem')[0]).toHaveAttribute('aria-current', 'step');
  expect(screen.getByRole('main')).toHaveClass('md:items-center');
  expect(screen.getByRole('main').firstElementChild).toHaveClass('md:h-[calc(100vh-48px)]');
  expect(screen.queryByText('Formulario')).not.toBeInTheDocument();
  expect(screen.queryByText('Confirmación')).not.toBeInTheDocument();
  expect(document.getElementById('address')?.tagName).toBe('TEXTAREA');
  expect(screen.getAllByText('Queremos conocerte mejor')).toHaveLength(2);
  expect(screen.queryByText('Empecemos por conocerte mejor.')).not.toBeInTheDocument();
});

it('offers only female and male sex options', () => {
  render(
    <MemoryRouter>
      <PublicRegistrationPage />
    </MemoryRouter>,
  );

  expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual([
    'Seleccionar...',
    'Femenino',
    'Masculino',
  ]);
});

async function fillFormToReview(user: ReturnType<typeof userEvent.setup>) {
  const field = (id: string) => document.getElementById(id) as HTMLInputElement;
  await user.type(field('firstName'), 'María');
  await user.type(field('lastName'), 'Prueba');
  await user.type(field('dateOfBirth'), '01011990');
  await user.type(field('phoneNumber'), '70000001');
  await user.selectOptions(field('sex'), 'female');
  await user.type(field('address'), 'Calle de prueba 123');
  await user.type(field('preferredStartDate'), '18092026');
  await user.click(screen.getByRole('button', { name: 'Centro' }));
  await user.click(screen.getByRole('button', { name: 'Continuar' }));

  await screen.findByRole('heading', { name: 'Tu salud' });
  await user.type(field('weight'), '60');
  await user.type(field('height'), '165');
  await user.click(screen.getByRole('button', { name: 'Continuar' }));

  await screen.findByRole('heading', { name: 'Revisa tus datos' });
}

it('shows a retry message when submitting the form fails due to a network error', async () => {
  const user = userEvent.setup();
  global.fetch = jest.fn().mockRejectedValue(new TypeError('Failed to fetch'));

  render(
    <MemoryRouter>
      <PublicRegistrationPage />
    </MemoryRouter>,
  );

  await fillFormToReview(user);
  await user.click(screen.getByRole('button', { name: 'Enviar solicitud' }));

  await waitFor(() =>
    expect(
      screen.getByText('No pudimos enviar tu solicitud. Intenta nuevamente.'),
    ).toBeInTheDocument(),
  );
  expect(screen.getByRole('button', { name: 'Enviar solicitud' })).toBeEnabled();
});

it('shows a loading state and sends one request when the submit button is clicked twice', async () => {
  const user = userEvent.setup();
  let resolveRequest: (response: Response) => void = () => {};
  global.fetch = jest.fn().mockReturnValue(
    new Promise<Response>((resolve) => {
      resolveRequest = resolve;
    }),
  );

  render(
    <MemoryRouter>
      <PublicRegistrationPage />
    </MemoryRouter>,
  );

  await fillFormToReview(user);
  const submit = screen.getByRole('button', { name: 'Enviar solicitud' });
  await user.click(submit);
  await user.click(submit);

  expect(submit).toBeDisabled();
  expect(global.fetch).toHaveBeenCalledTimes(1);

  resolveRequest({ ok: true } as Response);
  await screen.findByRole('heading', { name: 'Recibimos tu solicitud' });
});

it('shows a red error under each empty field and a summary instead of advancing', async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <PublicRegistrationPage />
    </MemoryRouter>,
  );

  await user.type(document.getElementById('firstName') as HTMLInputElement, 'María');
  await user.click(screen.getByRole('button', { name: 'Continuar' }));

  expect(screen.getByRole('heading', { name: 'Datos personales' })).toBeInTheDocument();
  expect(screen.getByText('Ingresa tu primer apellido')).toHaveClass('text-alert');
  expect(screen.getByText('Selecciona una zona')).toHaveClass('text-alert');
  expect(screen.queryByText('Ingresa tu primer nombre')).not.toBeInTheDocument();
  expect(document.getElementById('lastName')).toHaveAttribute('aria-invalid', 'true');
  expect(document.getElementById('lastName')).toHaveClass('border-alert');
  expect(screen.getByRole('alert')).toHaveTextContent('Revisa 7 campos antes de continuar');
});

it('clears a field error as soon as the field is filled', async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <PublicRegistrationPage />
    </MemoryRouter>,
  );

  await user.click(screen.getByRole('button', { name: 'Continuar' }));
  await user.type(document.getElementById('lastName') as HTMLInputElement, 'Pérez');

  expect(screen.queryByText('Ingresa tu primer apellido')).not.toBeInTheDocument();
  expect(screen.getByRole('alert')).toHaveTextContent('Revisa 7 campos antes de continuar');
});

it('turns off the browser validation popup so the inline errors are the only feedback', () => {
  render(
    <MemoryRouter>
      <PublicRegistrationPage />
    </MemoryRouter>,
  );

  expect(screen.getByRole('button', { name: 'Continuar' }).closest('form')).toHaveAttribute(
    'novalidate',
  );
});

it('flags weight and height on the health step', async () => {
  const user = userEvent.setup();
  const field = (id: string) => document.getElementById(id) as HTMLInputElement;
  render(
    <MemoryRouter>
      <PublicRegistrationPage />
    </MemoryRouter>,
  );

  await user.type(field('firstName'), 'María');
  await user.type(field('lastName'), 'Prueba');
  await user.type(field('dateOfBirth'), '01011990');
  await user.type(field('phoneNumber'), '70000001');
  await user.selectOptions(field('sex'), 'female');
  await user.type(field('address'), 'Calle de prueba 123');
  await user.type(field('preferredStartDate'), '18092026');
  await user.click(screen.getByRole('button', { name: 'Centro' }));
  await user.click(screen.getByRole('button', { name: 'Continuar' }));
  await screen.findByRole('heading', { name: 'Tu salud' });

  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Continuar' }));

  expect(screen.getByText('Ingresa tu peso')).toHaveClass('text-alert');
  expect(screen.getByText('Ingresa tu talla')).toHaveClass('text-alert');
  expect(screen.getByRole('alert')).toHaveTextContent('Revisa 2 campos antes de continuar');
});
