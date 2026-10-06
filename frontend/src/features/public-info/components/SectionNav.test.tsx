import { render, screen } from '@testing-library/react';
import { SectionNav } from './SectionNav';

it('renders the five summary cards as anchors into the page', () => {
  render(<SectionNav />);

  const links = screen.getAllByRole('link');

  expect(links.map((link) => [link.textContent, link.getAttribute('href')])).toEqual([
    ['Plan completo', '#plan-completo'],
    ['Qué incluye', '#que-incluye'],
    ['Tipos de plan', '#tipos-de-plan'],
    ['Precios', '#precios'],
    ['Entregas', '#entregas'],
  ]);
  expect(screen.getByRole('navigation', { name: 'Secciones' })).toBeInTheDocument();
  expect(screen.getByRole('list')).toHaveClass('reveal-stagger');
});
