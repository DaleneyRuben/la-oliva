import { render, screen } from '@testing-library/react';
import { PricingSection } from './PricingSection';

it('renders both complete-plan prices and the delivery card', () => {
  render(<PricingSection />);

  expect(screen.getByRole('heading', { name: 'Precios planes completos' })).toBeInTheDocument();
  expect(screen.getByText('Bs. 1.450')).toBeInTheDocument();
  expect(screen.getByText('Bs. 1.550')).toBeInTheDocument();
  expect(screen.getAllByText('por 20 días')).toHaveLength(2);
  expect(
    screen.getByText('Incluye envío en la ciudad de La Paz. Laderas con costo extra.'),
  ).toBeInTheDocument();
  expect(screen.getByText('La fecha de inicio la decides tú.')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Quiero contratar mi plan' })).toHaveAttribute(
    'href',
    'https://wa.link/mrujyv',
  );

  expect(screen.getByRole('heading', { name: 'Entregamos en La Paz' })).toBeInTheDocument();
  expect(
    screen.getByText(
      'Todos los planes incluyen envío a domicilio en La Paz. Para laderas, consultar costo extra. La hora de entrega depende de la zona de tu domicilio.',
    ),
  ).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Consultar mi zona' })).toHaveAttribute(
    'href',
    'https://wa.link/0jp5dy',
  );
  expect(document.getElementById('precios')).not.toBeNull();
  expect(document.getElementById('entregas')).toHaveClass('reveal');
  expect(screen.getByText('Bs. 1.450').closest('li')).toHaveClass('hover:-translate-y-0.5');
  expect(screen.getByText('Bs. 1.450').closest('ul')).toHaveClass('reveal-stagger');
});
