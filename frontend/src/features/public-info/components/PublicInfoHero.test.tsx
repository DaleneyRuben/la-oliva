import { render, screen } from '@testing-library/react';
import { WHATSAPP_URL } from '@/constants/contact.constants';
import { PublicInfoHero } from './PublicInfoHero';

jest.mock('@/assets/public-info/hero.jpg', () => ({ __esModule: true, default: 'hero.jpg' }));

it('renders the hero slide copy, photo and WhatsApp button', () => {
  render(<PublicInfoHero />);

  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
    'Comer bien puede ser mucho más fácil',
  );
  expect(
    screen.getByText(
      'Comidas caseras, deliciosas y equilibradas, preparadas para acompañarte durante tu día, sin que tengas que preocuparte por cocinar o planificar cada comida.',
    ),
  ).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Quiero contratar' })).toHaveAttribute(
    'href',
    WHATSAPP_URL,
  );
  expect(screen.getByRole('img', { name: /Porciones de comida/ })).toHaveAttribute(
    'src',
    'hero.jpg',
  );
  expect(screen.getByRole('img', { name: 'La Oliva, catering con altura' })).toBeInTheDocument();
  expect(screen.getByText('Bs. 1.450')).toBeInTheDocument();
  expect(screen.getByText('por 20 días')).toBeInTheDocument();
});

it('staggers the hero entrance and slides the photo in from the right', () => {
  render(<PublicInfoHero />);

  expect(screen.getByText('Más que catering, experiencias que dejan huella.')).toHaveClass(
    'enter-up-1',
  );
  expect(screen.getByRole('heading', { level: 1 })).toHaveClass('enter-up-2');
  expect(screen.getByText(/Comidas caseras, deliciosas/)).toHaveClass('enter-up-3');
  expect(screen.getByRole('link', { name: 'Quiero contratar' }).parentElement).toHaveClass(
    'enter-up-4',
  );
  expect(screen.getByRole('img', { name: /Porciones de comida/ }).parentElement).toHaveClass(
    'enter-from-right',
  );
  expect(screen.getByText('Planes desde').parentElement).toHaveClass('enter-up-5');
});
