import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, useLocation } from 'react-router-dom';
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

function LocationDisplay() {
  const location = useLocation();

  return <output data-testid="location">{location.pathname}</output>;
}

function renderAt(element: React.ReactElement, path: string) {
  mockUseAuth.mockReturnValue({
    user: { id: '1', username: 'daleney', role: 'admin' },
    token: 'fake-token',
    setAuth: jest.fn(),
    clearAuth: jest.fn(),
  });

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[path]}>{element}</MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('frontend application compositions', () => {
  it('exposes staff login in the combined local application', () => {
    renderAt(<CombinedApp />, '/login');

    expect(screen.getByRole('heading', { name: 'Ingresar' })).toBeInTheDocument();
  });

  it('exposes public registration in the combined local application', () => {
    renderAt(<CombinedApp />, '/registro');

    expect(screen.getAllByRole('heading', { name: 'Comencemos a cuidar de ti' })).not.toHaveLength(
      0,
    );
  });

  it('exposes staff routes in the staff application', async () => {
    renderAt(<StaffApp />, '/clientes');

    expect(await screen.findByRole('heading', { name: 'Clientes' })).toBeInTheDocument();
  });

  it('redirects staff /registro visits to login', async () => {
    renderAt(
      <>
        <StaffApp />
        <LocationDisplay />
      </>,
      '/registro',
    );

    expect(await screen.findByRole('heading', { name: 'Ingresar' })).toBeInTheDocument();
    expect(screen.getByTestId('location')).toHaveTextContent('/login');
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

    expect(screen.getAllByRole('heading', { name: 'Comencemos a cuidar de ti' })).not.toHaveLength(
      0,
    );
  });

  it('does not expose login from the public application', async () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <PublicApp />
      </MemoryRouter>,
    );

    expect(
      await screen.findAllByRole('heading', { name: 'Comencemos a cuidar de ti' }),
    ).not.toHaveLength(0);
    expect(screen.queryByRole('heading', { name: 'Ingresar' })).not.toBeInTheDocument();
  });
});
