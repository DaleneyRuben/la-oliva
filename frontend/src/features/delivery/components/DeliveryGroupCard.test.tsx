import { render, screen } from '@testing-library/react';
import { DeliveryGroupCard } from '@/features/delivery/components/DeliveryGroupCard';
import type { DeliveryGroup } from '@/features/delivery/types';

const group: DeliveryGroup = {
  groupToken: 'tok-1',
  members: [
    {
      id: '1',
      name: 'Carmen Tapia',
      phone: '72591232',
      deliveryZone: 'Centro',
      address: 'C. Sucre #88, Centro',
      isNew: false,
    },
    {
      id: '2',
      name: 'Jorge Rengel',
      phone: '76651200',
      deliveryZone: 'Centro',
      address: 'C. Sucre #88, Centro',
      isNew: false,
    },
  ],
};

describe('DeliveryGroupCard', () => {
  it('shows the "Entrega conjunta" label', () => {
    render(<DeliveryGroupCard group={group} shift="day" />);
    expect(screen.getByText('Entrega conjunta')).toBeInTheDocument();
  });

  it('shows the member count chip', () => {
    render(<DeliveryGroupCard group={group} shift="day" />);
    expect(screen.getByText('2 clientes')).toBeInTheDocument();
  });

  it('renders every member', () => {
    render(<DeliveryGroupCard group={group} shift="day" />);
    expect(screen.getByText('Carmen Tapia')).toBeInTheDocument();
    expect(screen.getByText('Jorge Rengel')).toBeInTheDocument();
  });

  it('shows the shared address once, taken from the first member', () => {
    render(<DeliveryGroupCard group={group} shift="day" />);
    expect(screen.getAllByText('C. Sucre #88, Centro')).toHaveLength(1);
  });

  it('shows one outside-La-Oliva marker for the whole group', () => {
    render(
      <DeliveryGroupCard
        group={{
          ...group,
          members: group.members.map((member) => ({ ...member, delivery: 'Otro' as const })),
        }}
        shift="day"
      />,
    );

    expect(screen.getAllByText('Entrega fuera de La Oliva')).toHaveLength(1);
  });

  it('takes the warm palette inside the day run', () => {
    const { container } = render(<DeliveryGroupCard group={group} shift="day" />);
    expect((container.firstChild as HTMLElement).className).toContain('bg-delivery-2-card-bg');
  });

  it('takes the olive palette inside the night run', () => {
    const { container } = render(<DeliveryGroupCard group={group} shift="night" />);
    expect((container.firstChild as HTMLElement).className).toContain('bg-delivery-1-card-bg');
  });
});
