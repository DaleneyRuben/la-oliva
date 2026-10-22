import { render, screen } from '@testing-library/react';
import { DeliveryPersonRow } from '@/features/delivery/components/DeliveryPersonRow';

const person = {
  id: '1',
  name: 'Carmen Tapia',
  phone: '7259 1232',
  deliveryZone: 'Centro',
  address: 'C. Sucre #88, Centro',
  isNew: false,
};

describe('DeliveryPersonRow', () => {
  it('renders the name', () => {
    render(<DeliveryPersonRow person={person} avatarClass="" rowBorderClass="" />);
    expect(screen.getByText('Carmen Tapia')).toBeInTheDocument();
  });

  it('renders the initials in the avatar', () => {
    render(<DeliveryPersonRow person={person} avatarClass="" rowBorderClass="" />);
    expect(screen.getByText('CT')).toBeInTheDocument();
  });

  it('renders a tel: link with spaces stripped from the phone number', () => {
    render(<DeliveryPersonRow person={person} avatarClass="" rowBorderClass="" />);
    const link = screen.getByRole('link', { name: /7259 1232/ });
    expect(link).toHaveAttribute('href', 'tel:72591232');
  });

  it('stacks the phone directly under the name when there is no address (group member)', () => {
    const { container } = render(
      <DeliveryPersonRow person={person} avatarClass="" rowBorderClass="" />,
    );
    const row = container.firstChild as HTMLElement;
    const nameColumn = row.children[1];
    const link = screen.getByRole('link', { name: /7259 1232/ });
    expect(nameColumn).toContainElement(link);
  });

  // A single stop carries a long address. On wide screens the phone trails the row; on a phone
  // it sits under the address instead, so the address keeps the whole width.
  it('trails the phone on wide screens and stacks it under the address on phones (single)', () => {
    const { container } = render(
      <DeliveryPersonRow person={person} avatarClass="" rowBorderClass="" showAddress />,
    );
    const row = container.firstChild as HTMLElement;
    const nameColumn = row.children[1];
    const [stacked, trailing] = screen.getAllByRole('link', { name: /7259 1232/ });
    expect(nameColumn).toContainElement(stacked);
    expect(stacked.className).toContain('sm:hidden');
    expect(nameColumn).not.toContainElement(trailing);
    expect(trailing.className).toContain('hidden sm:inline-flex');
  });

  it('does not render the address by default', () => {
    render(<DeliveryPersonRow person={person} avatarClass="" rowBorderClass="" />);
    expect(screen.queryByText('C. Sucre #88, Centro')).not.toBeInTheDocument();
  });

  it('renders the address when showAddress is set', () => {
    render(<DeliveryPersonRow person={person} avatarClass="" rowBorderClass="" showAddress />);
    expect(screen.getByText('C. Sucre #88, Centro')).toBeInTheDocument();
  });

  it('does not show the "Nuevo" badge when isNew is false', () => {
    render(<DeliveryPersonRow person={person} avatarClass="" rowBorderClass="" />);
    expect(screen.queryByText('Nuevo')).not.toBeInTheDocument();
  });

  it('shows the "Nuevo" badge when isNew is true', () => {
    render(
      <DeliveryPersonRow person={{ ...person, isNew: true }} avatarClass="" rowBorderClass="" />,
    );
    expect(screen.getByText('Nuevo')).toBeInTheDocument();
  });

  it('identifies a client whose delivery is outside La Oliva', () => {
    render(
      <DeliveryPersonRow
        person={{ ...person, delivery: 'Otro' }}
        avatarClass=""
        rowBorderClass=""
      />,
    );

    expect(screen.getByText('Entrega fuera de La Oliva')).toBeInTheDocument();
  });
});
