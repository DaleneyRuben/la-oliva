import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import { CombinedApp } from '@/app/CombinedApp';
import { PublicApp } from '@/app/PublicApp';
import { StaffApp } from '@/app/StaffApp';

jest.mock('@/features/auth/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/services/api', () => ({
  default: {
    get: jest.fn().mockResolvedValue([]),
    post: jest.fn(),
  },
}));

const mockUseAuth = useAuth as jest.Mock;

function renderAt(element: React.ReactElement, path: string) {
  mockUseAuth.mockReturnValue({
    user: { id: '1', username: 'daleney', role: 'admin' },
    token: 'fake-token',
    setAuth: jest.fn(),
    clearAuth: jest.fn(),
  });

  return render(<MemoryRouter initialEntries={[path]}>{element}</MemoryRouter>);
}

describe('frontend application compositions', () => {
  it('exposes staff login in the combined local application', () => {
    renderAt(<CombinedApp />, '/login');

    expect(screen.getByRole('heading', { name: 'Iniciar sesión' })).toBeInTheDocument();
  });

  it('exposes public registration in the combined local application', () => {
    renderAt(<CombinedApp />, '/registro');

    expect(screen.getByRole('heading', { name: 'Comencemos a cuidar de ti' })).toBeInTheDocument();
  });

  it('exposes staff routes in the staff application', async () => {
    renderAt(<StaffApp />, '/clientes');

    expect(await screen.findByRole('heading', { name: 'Clientes' })).toBeInTheDocument();
  });

  it('redirects staff /registro visits to the configured public site', async () => {
    const redirect = jest.fn();

    renderAt(
      <StaffApp publicSiteUrl="https://registro.laoliva.example" redirect={redirect} />,
      '/registro',
    );

    await waitFor(() => {
      expect(redirect).toHaveBeenCalledWith('https://registro.laoliva.example/registro');
    });
    expect(screen.queryByText('Datos personales')).not.toBeInTheDocument();
  });

  it('renders public registration without staff authentication', () => {
    mockUseAuth.mockImplementation(() => {
      throw new Error('public application must not read staff authentication');
    });

    render(
      <MemoryRouter initialEntries={['/registro']}>
        <PublicApp />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Comencemos a cuidar de ti' })).toBeInTheDocument();
  });

  it('does not expose login from the public application', async () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <PublicApp />
      </MemoryRouter>,
    );

    expect(
      await screen.findByRole('heading', { name: 'Comencemos a cuidar de ti' }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Iniciar sesión' })).not.toBeInTheDocument();
  });
});
