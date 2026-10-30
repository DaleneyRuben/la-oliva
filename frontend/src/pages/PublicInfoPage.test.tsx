import { render, screen, within } from '@testing-library/react';
import { PublicInfoPage } from './PublicInfoPage';

function renderPage() {
  return render(<PublicInfoPage />);
}

it('shows the hero copy from the information slides', () => {
  renderPage();

  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
    'Comer bien puede ser mucho más fácil',
  );
  expect(screen.getByText('Más que catering, experiencias que dejan huella.')).toBeInTheDocument();
  expect(screen.getByText('Sabores que reúnen, momentos que perduran.')).toBeInTheDocument();
  expect(screen.getByText('Con altura, siempre.')).toBeInTheDocument();
  expect(screen.getByText('Planes desde')).toBeInTheDocument();
});

it('renders every section of the slides in order', () => {
  renderPage();

  const headings = screen
    .getAllByRole('heading', { level: 2 })
    .map((heading) => heading.textContent);

  expect(headings).toEqual([
    'Tu alimentación diaria, resuelta',
    'Más que solo comida',
    'Antes de comenzar',
    'Nuestros planes',
    'Precios planes completos',
    'Entregamos en La Paz',
    '¿Cómo funciona?',
    'Importante antes de contratar',
    '¿Tienes alguna consulta?',
  ]);
});

it('links the five summary cards to sections that exist on the page', () => {
  renderPage();

  const nav = screen.getByRole('navigation', { name: 'Secciones' });
  const links = within(nav).getAllByRole('link');

  expect(links.map((link) => link.textContent)).toEqual([
    'Plan completo',
    'Qué incluye',
    'Tipos de plan',
    'Precios',
    'Entregas',
  ]);
  links.forEach((link) => {
    const id = link.getAttribute('href')?.slice(1) ?? '';
    expect(document.getElementById(id)).not.toBeNull();
  });
});

it('sends each call-to-action button to its own WhatsApp link', () => {
  renderPage();

  const links = {
    'Quiero contratar': 'https://wa.link/mrujyv',
    'Quiero contratar mi plan': 'https://wa.link/mrujyv',
    'Consultar mi zona': 'https://wa.link/0jp5dy',
    'Tengo una consulta': 'https://wa.link/y0xmrv',
  };

  Object.entries(links).forEach(([name, href]) => {
    const link = screen.getByRole('link', { name });
    expect(link).toHaveAttribute('href', href);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});

it('shows only copy that exists on the slides', () => {
  renderPage();

  expect(screen.queryByText(/registrarme/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/ver planes/i)).not.toBeInTheDocument();
  expect(screen.queryByRole('banner')).not.toBeInTheDocument();
  expect(
    screen.getByRole('img', { name: 'La Oliva, catering con altura. Sabor, calidad, experiencia' }),
  ).toBeInTheDocument();
  expect(screen.getByText('Comer bien también es cuidarte')).toBeInTheDocument();
});

it('marks the page root so the document scrolls smoothly to anchors', () => {
  renderPage();

  expect(screen.getByRole('main')).toHaveClass('public-info-page');
  expect(screen.getByRole('main')).not.toHaveClass('scroll-smooth');
});
