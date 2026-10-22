import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import type { NewClientFormValues } from '@/features/clients/types';
import { StepIdentity } from './StepIdentity';

function Wrapper() {
  const {
    register,
    control,
    formState: { errors },
  } = useForm<NewClientFormValues>({
    defaultValues: {
      name: '',
      sex: '',
      dateOfBirth: '',
      phoneNumber: '',
      address: '',
      deliveryZone: '',
      delivery: '',
      deliveryShift: 'day',
      nit: '',
      businessName: '',
    },
  });
  return <StepIdentity register={register} control={control} errors={errors} />;
}

it('renders the name field', () => {
  render(<Wrapper />);
  expect(screen.getByLabelText(/nombre completo/i)).toBeInTheDocument();
});

it('renders the sex selector', () => {
  render(<Wrapper />);
  expect(screen.getByLabelText(/sexo/i)).toBeInTheDocument();
});

it('renders the phone number field', () => {
  render(<Wrapper />);
  expect(screen.getByLabelText(/celular/i)).toBeInTheDocument();
});

it('renders the address field', () => {
  render(<Wrapper />);
  expect(screen.getByLabelText(/dirección/i)).toBeInTheDocument();
});

it('renders the NIT field', () => {
  render(<Wrapper />);
  expect(screen.getByLabelText(/nit/i)).toBeInTheDocument();
});

it('asks for the delivery shift only once La Oliva is chosen', async () => {
  render(<Wrapper />);
  expect(screen.queryByRole('radiogroup', { name: 'Turno de entrega' })).not.toBeInTheDocument();

  await userEvent.click(screen.getByRole('button', { name: 'La Oliva' }));

  expect(screen.getByRole('radio', { name: /Día/ })).toHaveAttribute('aria-checked', 'true');

  await userEvent.click(screen.getByRole('button', { name: 'Otro' }));

  expect(screen.queryByRole('radiogroup', { name: 'Turno de entrega' })).not.toBeInTheDocument();
});
