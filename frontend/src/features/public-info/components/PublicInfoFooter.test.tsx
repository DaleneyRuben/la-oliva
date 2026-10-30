import { render, screen } from '@testing-library/react';
import { PublicInfoFooter } from './PublicInfoFooter';

it('closes the page with the La Oliva logo', () => {
  render(<PublicInfoFooter />);

  expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  expect(
    screen.getByRole('img', { name: 'La Oliva, catering con altura. Sabor, calidad, experiencia' }),
  ).toBeInTheDocument();
});
