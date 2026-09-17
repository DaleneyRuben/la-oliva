import { render, screen } from '@testing-library/react';
import { createInitialRegistrationForm } from '@/features/public-registration/types';
import { PersonalDetailsStep } from './PersonalDetailsStep';

it('uses the shared calendar inputs for both public registration dates', () => {
  render(<PersonalDetailsStep form={createInitialRegistrationForm()} update={jest.fn()} />);

  expect(screen.getAllByPlaceholderText('dd/mm/aaaa')).toHaveLength(2);
});
