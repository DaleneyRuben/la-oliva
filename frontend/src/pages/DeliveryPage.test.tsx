import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import api from '@/services/api';
import { DeliveryPage } from '@/pages/DeliveryPage';

jest.mock('@/services/api', () => ({
  default: { get: jest.fn() },
}));

const mockGet = api.get as jest.Mock;

const person = (id: string, name: string, deliveryZone = 'Sur') => ({
  id,
  name,
  phone: '70000000',
  deliveryZone,
});

type Zones = { zone: string; deliveryCount: number; groups: never[]; singles: unknown[] }[];

const route = (date: string, dayZones: Zones = [], nightZones: Zones = []) => ({
  day: { mealDate: date, zones: dayZones },
  night: { mealDate: date, zones: nightZones },
});

const renderPage = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <DeliveryPage />
    </QueryClientProvider>,
  );
};

beforeEach(() => jest.clearAllMocks());

describe('DeliveryPage', () => {
  it('renders the Entregas heading', async () => {
    mockGet.mockResolvedValue({
      '2026-06-25': route('2026-06-25'),
      '2026-06-26': route('2026-06-26'),
    });
    renderPage();
    expect(await screen.findByRole('heading', { name: 'Entregas' })).toBeInTheDocument();
  });

  it('shows an empty state when the selected day has no zones', async () => {
    mockGet.mockResolvedValue({
      '2026-06-25': route('2026-06-25'),
      '2026-06-26': route('2026-06-26'),
    });
    renderPage();
    expect(await screen.findByText('Sin entregas programadas')).toBeInTheDocument();
  });

  it('shows today data by default', async () => {
    mockGet.mockResolvedValue({
      '2026-06-25': route('2026-06-25', [
        { zone: 'Sur', deliveryCount: 1, groups: [], singles: [person('1', 'Ana López')] },
      ]),
      '2026-06-26': route('2026-06-26'),
    });
    renderPage();
    expect(await screen.findByText('Ana López')).toBeInTheDocument();
  });

  it('switches to manana data when the Mañana tab is clicked', async () => {
    mockGet.mockResolvedValue({
      '2026-06-25': route('2026-06-25', [
        { zone: 'Sur', deliveryCount: 1, groups: [], singles: [person('1', 'Ana López')] },
      ]),
      '2026-06-26': route('2026-06-26', [
        { zone: 'Centro', deliveryCount: 1, groups: [], singles: [person('2', 'Zara Gomez')] },
      ]),
    });
    renderPage();
    await screen.findByText('Ana López');

    await userEvent.click(screen.getByRole('button', { name: /mañana/i }));

    await waitFor(() => expect(screen.getByText('Zara Gomez')).toBeInTheDocument());
    expect(screen.queryByText('Ana López')).not.toBeInTheDocument();
  });

  it('shows delivery counts on both tab badges', async () => {
    mockGet.mockResolvedValue({
      '2026-06-25': route('2026-06-25', [
        { zone: 'Sur', deliveryCount: 2, groups: [], singles: [] },
      ]),
      '2026-06-26': route('2026-06-26', [
        { zone: 'Sur', deliveryCount: 5, groups: [], singles: [] },
      ]),
    });
    renderPage();
    await waitFor(() => expect(screen.getByText('2')).toBeInTheDocument());
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('shows the zone for the selected day', async () => {
    mockGet.mockResolvedValue({
      '2026-06-25': route('2026-06-25', [
        { zone: 'Sur', deliveryCount: 1, groups: [], singles: [person('1', 'Ana López')] },
      ]),
      '2026-06-26': route('2026-06-26'),
    });
    renderPage();
    expect(await screen.findByText('Zona Sur')).toBeInTheDocument();
  });

  it('shows the day and night runs of the selected day, each with its own clients', async () => {
    mockGet.mockResolvedValue({
      '2026-10-22': route(
        '2026-10-22',
        [{ zone: 'Sur', deliveryCount: 1, groups: [], singles: [person('1', 'Ana López')] }],
        [{ zone: 'Centro', deliveryCount: 1, groups: [], singles: [person('2', 'Iván Quiroga')] }],
      ),
      '2026-10-23': route('2026-10-23'),
    });
    renderPage();

    const day = await screen.findByRole('region', { name: 'Turno día' });
    const night = screen.getByRole('region', { name: 'Turno noche' });
    expect(within(day).getByText('Ana López')).toBeInTheDocument();
    expect(within(night).getByText('Iván Quiroga')).toBeInTheDocument();
  });

  it('counts both runs on the tab badge', async () => {
    mockGet.mockResolvedValue({
      '2026-10-22': route(
        '2026-10-22',
        [{ zone: 'Sur', deliveryCount: 7, groups: [], singles: [] }],
        [{ zone: 'Sur', deliveryCount: 5, groups: [], singles: [] }],
      ),
      '2026-10-23': route('2026-10-23'),
    });
    renderPage();

    expect(await screen.findByRole('button', { name: /hoy 12/i })).toBeInTheDocument();
  });

  it('shows a night run alone on a day with no day deliveries', async () => {
    mockGet.mockResolvedValue({
      '2026-10-25': route(
        '2026-10-25',
        [],
        [{ zone: 'Sur', deliveryCount: 1, groups: [], singles: [person('1', 'Julia Cuentas')] }],
      ),
      '2026-10-26': route('2026-10-26'),
    });
    renderPage();

    expect(await screen.findByText('Julia Cuentas')).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Turno día' })).toHaveTextContent(
      'Sin entregas de día.',
    );
    expect(screen.queryByText('Sin entregas programadas')).not.toBeInTheDocument();
  });

  it('keys the two runs by colour in the legend', async () => {
    mockGet.mockResolvedValue({
      '2026-10-22': route('2026-10-22', [
        { zone: 'Sur', deliveryCount: 1, groups: [], singles: [person('1', 'Ana López')] },
      ]),
      '2026-10-23': route('2026-10-23'),
    });
    renderPage();

    const legend = await screen.findByLabelText('Leyenda de turnos');
    expect(legend).toHaveTextContent('Día');
    expect(legend).toHaveTextContent('Noche');
  });
});
