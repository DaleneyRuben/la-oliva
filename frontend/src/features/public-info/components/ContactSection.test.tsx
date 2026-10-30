import { render, screen } from '@testing-library/react';
import { ContactSection } from './ContactSection';

it('renders the contact invitation and the closing script line', () => {
  render(<ContactSection />);

  expect(screen.getByRole('heading', { name: '¿Tienes alguna consulta?' })).toBeInTheDocument();
  expect(screen.getByText('Cualquier duda estamos para ayudarte con gusto.')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Tengo una consulta' })).toHaveAttribute(
    'href',
    'https://wa.link/y0xmrv',
  );
  expect(screen.getByText('Comer bien también es cuidarte')).toBeInTheDocument();
  expect(screen.getAllByRole('link')).toHaveLength(1);
  expect(document.getElementById('contacto')).toHaveClass('reveal');
});
