import { render, screen } from '@testing-library/react';
import { FieldError } from '@ui/FieldError';

describe('FieldError', () => {
  it('shows the message in the alert color so it reads as an error, not a warning', () => {
    render(<FieldError>Nombre es requerido</FieldError>);
    expect(screen.getByText('Nombre es requerido')).toHaveClass('text-alert', 'font-semibold');
  });

  it('leads with a decorative icon', () => {
    render(<FieldError>Nombre es requerido</FieldError>);
    const icon = screen.getByText('Nombre es requerido').querySelector('[aria-hidden="true"]');
    expect(icon?.querySelector('svg')).toBeInTheDocument();
  });
});
