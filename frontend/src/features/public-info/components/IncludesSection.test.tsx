import { render, screen, within } from '@testing-library/react';
import { IncludesSection } from './IncludesSection';

it('lists what the plan includes and the steps before starting', () => {
  render(<IncludesSection />);

  expect(screen.getByRole('heading', { name: 'Más que solo comida' })).toBeInTheDocument();
  expect(screen.getByText('¿Qué incluye tu plan?')).toBeInTheDocument();

  const checklist = screen.getByRole('list', { name: '¿Qué incluye tu plan?' });
  expect(
    within(checklist)
      .getAllByRole('listitem')
      .map((item) => item.textContent),
  ).toEqual([
    'Alimentación completa durante 20 días',
    'Servicio de lunes a viernes',
    '5 o 6 comidas diarias + jugo vitamínico',
    'Menú personalizado según tus objetivos y gustos',
    'Comidas caseras y variadas',
    'Envío a domicilio incluido en La Paz',
    'Entregas a partir de las 07:00 am',
    'Puedes consumir la comida al momento de la entrega o almacenarla',
  ]);
  expect(screen.getByText('Comida real para una vida real')).toBeInTheDocument();

  expect(screen.getByRole('heading', { name: 'Antes de comenzar' })).toBeInTheDocument();
  expect(screen.getByText('Anamnesis virtual')).toBeInTheDocument();
  expect(screen.getByText('Gratis')).toBeInTheDocument();
  expect(screen.getByText('Evaluación presencial')).toBeInTheDocument();
  expect(screen.getByText('Bs. 50')).toBeInTheDocument();
  expect(screen.getByText('Pago antes de iniciar')).toBeInTheDocument();
  expect(screen.getByText('mediante transferencia, depósito o QR')).toBeInTheDocument();
  expect(document.getElementById('que-incluye')).not.toBeNull();
});
