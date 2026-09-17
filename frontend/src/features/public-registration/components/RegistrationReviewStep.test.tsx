import { render, screen } from '@testing-library/react';
import { createInitialRegistrationForm } from '@/features/public-registration/types';
import { RegistrationReviewStep } from './RegistrationReviewStep';

it('includes allergies, intolerances, and preferences in the application review', () => {
  const form = {
    ...createInitialRegistrationForm(),
    restrictions: ['Maní', 'Sin lactosa'],
  };

  render(<RegistrationReviewStep form={form} />);

  expect(screen.getByText('Alergias, intolerancias y gustos')).toBeInTheDocument();
  expect(screen.getByText('Maní · Sin lactosa')).toBeInTheDocument();
});
