import { render, screen } from '@testing-library/react';
import { createInitialRegistrationForm } from '@/features/public-registration/types';
import { HealthDetailsStep } from './HealthDetailsStep';

it('explains that approximate weight and height are acceptable', () => {
  render(
    <HealthDetailsStep
      form={createInitialRegistrationForm()}
      update={jest.fn()}
      addListItem={jest.fn()}
      removeListItem={jest.fn()}
      toggleDisease={jest.fn()}
    />,
  );

  expect(
    screen.getByText('Si no tiene el dato exacto puede poner un aproximado'),
  ).toBeInTheDocument();
});
