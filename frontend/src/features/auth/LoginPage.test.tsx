import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import { LoginPage } from '@/features/auth/LoginPage';

jest.mock('@/features/auth/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('@/assets/logo.png', () => ({ __esModule: true, default: 'classic-logo.png' }));
jest.mock('@/assets/la-oliva-logo.png', () => ({ __esModule: true, default: 'la-oliva-logo.png' }));

const mockNavigate = jest.fn();
const mockSetAuth = jest.fn();

function renderPage() {
  (useAuth as jest.Mock).mockReturnValue({ setAuth: mockSetAuth });
  (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  return render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>,
  );
}

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('disables submit when fields are empty', () => {
    renderPage();
    expect(screen.getByRole('button', { name: 'Ingresar' })).toBeDisabled();
  });

  it('uses the La Oliva logo by default', () => {
    renderPage();

    expect(screen.getAllByAltText('La Oliva')[0]).toHaveAttribute('src', 'la-oliva-logo.png');
  });

  it('uses semantic primary surfaces for the brand panel and submit action', async () => {
    renderPage();

    expect(screen.getByTestId('login-brand-panel')).toHaveClass('bg-sidebar');
    expect(document.querySelector('.login-panel-glow')).not.toBeInTheDocument();
    await userEvent.type(screen.getByLabelText(/usuario/i, { selector: 'input' }), 'admin');
    await userEvent.type(screen.getByLabelText(/contraseña/i, { selector: 'input' }), 'secret');
    expect(screen.getByRole('button', { name: 'Ingresar' })).toHaveClass('bg-brand-primary');
  });

  it('offers the compact theme selector', () => {
    renderPage();

    expect(screen.getByRole('radio', { name: 'La Oliva' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Clásica' })).toBeInTheDocument();
  });

  it('enables submit when both fields are filled', async () => {
    renderPage();
    await userEvent.type(screen.getByLabelText(/usuario/i, { selector: 'input' }), 'admin');
    await userEvent.type(screen.getByLabelText(/contraseña/i, { selector: 'input' }), 'secret');
    expect(screen.getByRole('button', { name: 'Ingresar' })).not.toBeDisabled();
  });

  it('calls setAuth and navigates to / on successful admin login', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({ token: 'tok', user: { id: 'enc1', username: 'admin', role: 'admin' } }),
    }) as jest.Mock;

    renderPage();
    await userEvent.type(screen.getByLabelText(/usuario/i, { selector: 'input' }), 'admin');
    await userEvent.type(screen.getByLabelText(/contraseña/i, { selector: 'input' }), 'secret');
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }));

    await waitFor(() => {
      expect(mockSetAuth).toHaveBeenCalledWith(
        { id: 'enc1', username: 'admin', role: 'admin' },
        'tok',
      );
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });
  });

  it('navigates to /menu for kitchen role', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          token: 'tok',
          user: { id: 'enc3', username: 'cocina', role: 'kitchen' },
        }),
    }) as jest.Mock;

    renderPage();
    await userEvent.type(screen.getByLabelText(/usuario/i, { selector: 'input' }), 'cocina');
    await userEvent.type(screen.getByLabelText(/contraseña/i, { selector: 'input' }), 'secret');
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/menu', { replace: true });
    });
  });

  it('navigates to /entregas for delivery role', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          token: 'tok',
          user: { id: 'enc2', username: 'repartidor', role: 'delivery' },
        }),
    }) as jest.Mock;

    renderPage();
    await userEvent.type(screen.getByLabelText(/usuario/i, { selector: 'input' }), 'repartidor');
    await userEvent.type(screen.getByLabelText(/contraseña/i, { selector: 'input' }), 'pass');
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/entregas', { replace: true });
    });
  });

  it('navigates to /evaluaciones for nutritionist role', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          token: 'tok',
          user: { id: 'enc4', username: 'nutri', role: 'nutritionist' },
        }),
    }) as jest.Mock;

    renderPage();
    await userEvent.type(screen.getByLabelText(/usuario/i, { selector: 'input' }), 'nutri');
    await userEvent.type(screen.getByLabelText(/contraseña/i, { selector: 'input' }), 'secret');
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/evaluaciones', { replace: true });
    });
  });

  it('navigates to /clientes for audit role', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({ token: 'tok', user: { id: 'enc5', username: 'audit', role: 'audit' } }),
    }) as jest.Mock;

    renderPage();
    await userEvent.type(screen.getByLabelText(/usuario/i, { selector: 'input' }), 'audit');
    await userEvent.type(screen.getByLabelText(/contraseña/i, { selector: 'input' }), 'secret');
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/clientes', { replace: true });
    });
  });

  it('shows error message on failed login', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'Credenciales inválidas' }),
    }) as jest.Mock;

    renderPage();
    await userEvent.type(screen.getByLabelText(/usuario/i, { selector: 'input' }), 'bad');
    await userEvent.type(screen.getByLabelText(/contraseña/i, { selector: 'input' }), 'wrong');
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }));

    expect(await screen.findByText('Credenciales inválidas')).toBeInTheDocument();
  });

  it('shows network error on fetch failure', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('network')) as jest.Mock;

    renderPage();
    await userEvent.type(screen.getByLabelText(/usuario/i, { selector: 'input' }), 'admin');
    await userEvent.type(screen.getByLabelText(/contraseña/i, { selector: 'input' }), 'secret');
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }));

    expect(await screen.findByText('No se pudo conectar con el servidor')).toBeInTheDocument();
  });

  it('toggles password input visibility', async () => {
    renderPage();
    const input = screen.getByLabelText(/contraseña/i, { selector: 'input' });
    expect(input).toHaveAttribute('type', 'password');
    await userEvent.click(screen.getByRole('button', { name: 'Mostrar contraseña' }));
    expect(input).toHaveAttribute('type', 'text');
  });
});
