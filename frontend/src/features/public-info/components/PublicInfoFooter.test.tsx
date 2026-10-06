import { render, screen } from '@testing-library/react';
import { PublicInfoFooter } from './PublicInfoFooter';

it('renders the brand lockup and the three values', () => {
  render(<PublicInfoFooter />);

  expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  expect(screen.getByText('La Oliva Catering')).toBeInTheDocument();
  expect(screen.getByText('Catering con altura')).toBeInTheDocument();
  expect(screen.getByText('Sabor')).toBeInTheDocument();
  expect(screen.getByText('Calidad')).toBeInTheDocument();
  expect(screen.getByText('Experiencia')).toBeInTheDocument();
});
