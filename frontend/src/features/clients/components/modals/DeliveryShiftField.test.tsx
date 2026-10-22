import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeliveryShiftField } from '@/features/clients/components/modals/DeliveryShiftField';

const gary = { id: '2', name: 'Gary Anze' };
const rocio = { id: '3', name: 'Rocío Aliaga' };

describe('DeliveryShiftField', () => {
  it('lets the shift be changed', async () => {
    const onChange = jest.fn();
    render(
      <DeliveryShiftField shift="day" savedShift="day" groupMembers={[]} onChange={onChange} />,
    );

    await userEvent.click(screen.getByRole('radio', { name: /Noche/ }));

    expect(onChange).toHaveBeenCalledWith('night');
  });

  it('warns that the whole group moves when a grouped client changes shift', () => {
    render(
      <DeliveryShiftField
        shift="night"
        savedShift="day"
        groupMembers={[gary, rocio]}
        onChange={jest.fn()}
      />,
    );

    expect(screen.getByRole('note')).toHaveTextContent(
      'Entrega conjunta con Gary Anze y Rocío Aliaga. El turno es el mismo para todo el grupo: al guardar, Gary Anze y Rocío Aliaga también pasan a Noche.',
    );
  });

  it('uses the singular for a group of two', () => {
    render(
      <DeliveryShiftField
        shift="night"
        savedShift="day"
        groupMembers={[gary]}
        onChange={jest.fn()}
      />,
    );

    expect(screen.getByRole('note')).toHaveTextContent('Gary Anze también pasa a Noche.');
  });

  it('says nothing while the shift is unchanged or the client has no group', () => {
    const { rerender } = render(
      <DeliveryShiftField
        shift="day"
        savedShift="day"
        groupMembers={[gary]}
        onChange={jest.fn()}
      />,
    );
    expect(screen.queryByRole('note')).not.toBeInTheDocument();

    rerender(
      <DeliveryShiftField shift="night" savedShift="day" groupMembers={[]} onChange={jest.fn()} />,
    );
    expect(screen.queryByRole('note')).not.toBeInTheDocument();
  });
});
