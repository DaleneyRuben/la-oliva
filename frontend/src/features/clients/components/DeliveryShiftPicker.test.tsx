import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeliveryShiftPicker } from '@/features/clients/components/DeliveryShiftPicker';

describe('DeliveryShiftPicker', () => {
  it('offers Día and Noche with what each one means', () => {
    render(<DeliveryShiftPicker value="day" onChange={jest.fn()} />);

    expect(screen.getByRole('radiogroup', { name: 'Turno de entrega' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Día/ })).toHaveAccessibleName(
      /En la mañana del día de la comida/,
    );
    expect(screen.getByRole('radio', { name: /Noche/ })).toHaveAccessibleName(
      /La noche anterior, de domingo a jueves/,
    );
  });

  it('marks the selected shift as checked', () => {
    render(<DeliveryShiftPicker value="night" onChange={jest.fn()} />);

    expect(screen.getByRole('radio', { name: /Noche/ })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: /Día/ })).toHaveAttribute('aria-checked', 'false');
  });

  it('reports the shift picked', async () => {
    const onChange = jest.fn();
    render(<DeliveryShiftPicker value="day" onChange={onChange} />);

    await userEvent.click(screen.getByRole('radio', { name: /Noche/ }));

    expect(onChange).toHaveBeenCalledWith('night');
  });
});
