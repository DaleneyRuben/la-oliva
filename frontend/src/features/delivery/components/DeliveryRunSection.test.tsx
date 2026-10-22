import { render, screen, within } from '@testing-library/react';
import { DeliveryRunSection } from '@/features/delivery/components/DeliveryRunSection';
import type { DeliveryRun } from '@/features/delivery/types';

const person = (id: string, name: string) => ({
  id,
  name,
  phone: '70000000',
  deliveryZone: 'Sur',
  address: 'Calle 1',
  isNew: false,
});

const run = (overrides: Partial<DeliveryRun> = {}): DeliveryRun => ({
  mealDate: '2026-10-23',
  zones: [
    { zone: 'Sur', deliveryCount: 2, groups: [], singles: [person('1', 'Julia Cuentas')] },
    { zone: 'Centro', deliveryCount: 3, groups: [], singles: [person('2', 'Iván Quiroga')] },
  ],
  ...overrides,
});

describe('DeliveryRunSection', () => {
  it('titles the night run and says which meals it carries', () => {
    render(<DeliveryRunSection shift="night" run={run()} />);

    const section = screen.getByRole('region', { name: 'Turno noche' });
    expect(within(section).getByRole('heading', { name: 'Turno noche' })).toBeInTheDocument();
    expect(section).toHaveTextContent('Reparto en la noche · comidas del viernes 23');
  });

  it('titles the day run as a morning run', () => {
    render(<DeliveryRunSection shift="day" run={run({ mealDate: '2026-10-22' })} />);

    expect(screen.getByRole('region', { name: 'Turno día' })).toHaveTextContent(
      'Reparto en la mañana · comidas del jueves 22',
    );
  });

  it('counts the stops across every zone of the run', () => {
    render(<DeliveryRunSection shift="night" run={run()} />);

    expect(screen.getByText('5 entregas')).toBeInTheDocument();
  });

  it('lists each zone of the run', () => {
    render(<DeliveryRunSection shift="night" run={run()} />);

    expect(screen.getByText('Zona Sur')).toBeInTheDocument();
    expect(screen.getByText('Zona Centro')).toBeInTheDocument();
    expect(screen.getByText('Julia Cuentas')).toBeInTheDocument();
  });

  it('says so when the run has no stops', () => {
    render(<DeliveryRunSection shift="day" run={run({ zones: [] })} />);

    expect(screen.getByRole('region', { name: 'Turno día' })).toHaveTextContent(
      'Sin entregas de día.',
    );
    expect(screen.queryByText(/comidas del/)).not.toBeInTheDocument();
  });

  it('heads the day run in gold and the night run in dark olive', () => {
    render(
      <>
        <DeliveryRunSection shift="day" run={run({ mealDate: '2026-10-22' })} />
        <DeliveryRunSection shift="night" run={run()} />
      </>,
    );

    const dayHeading = screen.getByRole('heading', { name: 'Turno día' });
    const nightHeading = screen.getByRole('heading', { name: 'Turno noche' });
    expect(dayHeading.closest('header')?.className).toContain('bg-delivery-2-chip-bg');
    expect(nightHeading.closest('header')?.className).toContain('bg-olive-900');
  });
});
