import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useMenu } from '@/features/menu/hooks/useMenu';
import { emptyDraft } from '@/features/menu/menuFields';
import { MenuImportPage } from '@/pages/MenuImportPage';

jest.mock('@/features/menu/hooks/useMenu', () => ({ useMenu: jest.fn() }));

const mockSaveWeek = jest.fn();

function setupMenu(overrides: object = {}) {
  (useMenu as jest.Mock).mockReturnValue({
    menus: [{ id: '1', ...emptyDraft('2026-10-05'), breakfast: 'Pancakes' }],
    isLoading: false,
    isSaving: false,
    saveWeek: mockSaveWeek,
    ...overrides,
  });
}

const user = () => userEvent.setup({ delay: null });

describe('MenuImportPage', () => {
  beforeEach(() => {
    // Wednesday 7 Oct 2026
    jest.useFakeTimers().setSystemTime(new Date('2026-10-07T12:00:00'));
    jest.clearAllMocks();
    mockSaveWeek.mockResolvedValue(undefined);
    setupMenu();
  });

  afterEach(() => jest.useRealTimers());

  it('renders the heading', () => {
    render(<MenuImportPage />);
    expect(screen.getByRole('heading', { name: 'Menú semanal' })).toBeInTheDocument();
  });

  it('shows a status card for each day of this week, tagging today and tomorrow', () => {
    render(<MenuImportPage />);
    expect(screen.getByText('5 – 9 oct')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Editar menú del lunes 5 oct' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Editar menú del miércoles 7 oct' })).toBeEnabled();
    expect(screen.getByText('Hoy')).toBeInTheDocument();
    expect(screen.getByText('Mañana')).toBeInTheDocument();
  });

  it('shows the saved menu in the week grid', () => {
    render(<MenuImportPage />);
    expect(within(screen.getByTestId('week-grid')).getByText('Pancakes')).toBeInTheDocument();
  });

  it('switches to next week', async () => {
    render(<MenuImportPage />);
    await user().click(screen.getByRole('tab', { name: 'Próxima semana' }));
    expect(screen.getByText('12 – 16 oct')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Editar menú del lunes 12 oct' })).toBeEnabled();
  });

  it('edits the whole week and saves it', async () => {
    render(<MenuImportPage />);
    const u = user();
    await u.click(screen.getByRole('button', { name: 'Editar semana' }));

    const grid = within(screen.getByTestId('week-edit-grid'));
    await u.type(grid.getByRole('textbox', { name: 'Almuerzo del viernes 9 oct' }), 'Pollo');
    await u.click(screen.getByRole('button', { name: 'Guardar semana' }));

    expect(mockSaveWeek).toHaveBeenCalledWith([{ ...emptyDraft('2026-10-09'), lunch: 'Pollo' }]);
    await waitFor(() => expect(screen.queryByTestId('week-edit-grid')).not.toBeInTheDocument());
  });

  it('opens the editor from a day card', async () => {
    render(<MenuImportPage />);
    await user().click(screen.getByRole('button', { name: 'Editar menú del jueves 8 oct' }));
    expect(screen.getByTestId('week-edit-grid')).toBeInTheDocument();
    expect(screen.queryByRole('tab', { name: 'Próxima semana' })).not.toBeInTheDocument();
  });

  it('shows the skeleton while loading', () => {
    setupMenu({ isLoading: true, menus: [] });
    render(<MenuImportPage />);
    expect(screen.queryByTestId('week-grid')).not.toBeInTheDocument();
  });
});
