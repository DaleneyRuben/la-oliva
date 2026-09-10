import { render, screen } from '@testing-library/react';
import { PageLoader } from './PageLoader';

jest.mock('@/assets/logo.png', () => ({ __esModule: true, default: 'classic-logo.png' }));
jest.mock('@/assets/la-oliva-logo.png', () => ({ __esModule: true, default: 'la-oliva-logo.png' }));

it('renders the loading label', () => {
  render(<PageLoader />);
  expect(screen.getByText(/cargando/i)).toBeInTheDocument();
});

it('uses the La Oliva logo by default', () => {
  render(<PageLoader />);
  expect(screen.getByAltText('La Oliva')).toHaveAttribute('src', 'la-oliva-logo.png');
});
