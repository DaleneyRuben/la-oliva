import { render, screen } from '@testing-library/react';
import { DeliveryZoneSection } from '@/features/delivery/components/DeliveryZoneSection';
import type { DeliveryZone } from '@/features/delivery/types';

const person = (id: string, name: string) => ({ id, name, phone: '70000000', deliveryZone: 'Sur' });

describe('DeliveryZoneSection', () => {
  it('shows the zone label', () => {
    const zone: DeliveryZone = { zone: 'Sur', deliveryCount: 0, groups: [], singles: [] };
    render(<DeliveryZoneSection zone={zone} shift="day" />);
    expect(screen.getByText('Zona Sur')).toBeInTheDocument();
  });

  it('shows the delivery count, pluralized', () => {
    const zone: DeliveryZone = { zone: 'Sur', deliveryCount: 3, groups: [], singles: [] };
    render(<DeliveryZoneSection zone={zone} shift="day" />);
    expect(screen.getByText('3 entregas')).toBeInTheDocument();
  });

  it('shows singular entrega count', () => {
    const zone: DeliveryZone = { zone: 'Sur', deliveryCount: 1, groups: [], singles: [] };
    render(<DeliveryZoneSection zone={zone} shift="day" />);
    expect(screen.getByText('1 entrega')).toBeInTheDocument();
  });

  it('renders group cards when groups exist', () => {
    const zone: DeliveryZone = {
      zone: 'Sur',
      deliveryCount: 1,
      groups: [{ groupToken: 'tok-1', members: [person('1', 'Carmen Tapia')] }],
      singles: [],
    };
    render(<DeliveryZoneSection zone={zone} shift="day" />);
    expect(screen.getByText('Entrega conjunta')).toBeInTheDocument();
    expect(screen.getByText('Carmen Tapia')).toBeInTheDocument();
  });

  it('lists individual stops straight under the zone heading', () => {
    const zone: DeliveryZone = {
      zone: 'Sur',
      deliveryCount: 2,
      groups: [],
      singles: [person('1', 'Ana López'), person('2', 'Zara Gomez')],
    };
    render(<DeliveryZoneSection zone={zone} shift="night" />);
    expect(screen.getByText('Ana López')).toBeInTheDocument();
    expect(screen.getByText('Zara Gomez')).toBeInTheDocument();
    expect(screen.queryByText('Individuales')).not.toBeInTheDocument();
  });
});
