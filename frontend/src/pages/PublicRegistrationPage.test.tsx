import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PublicRegistrationPage } from './PublicRegistrationPage';

it('shows the public registration heading', () => {
  render(
    <MemoryRouter>
      <PublicRegistrationPage />
    </MemoryRouter>,
  );

  expect(screen.getByRole('heading', { name: 'Cuéntanos un poco sobre ti.' })).toBeInTheDocument();
});
