import { render, screen, within } from '@testing-library/react';
import { HowItWorksSection } from './HowItWorksSection';

it('renders the four numbered steps and the four notices', () => {
  render(<HowItWorksSection />);

  const steps = screen.getByRole('list', { name: '¿Cómo funciona?' });
  expect(
    within(steps)
      .getAllByRole('listitem')
      .map((item) => item.textContent),
  ).toEqual([
    '01Nos contactas por WhatsApp',
    '02Realizamos anamnesis virtual o evaluación presencial',
    '03Personalizamos tu plan',
    '04Comenzamos con tus entregas',
  ]);

  expect(steps).toHaveClass('reveal-stagger');

  const notices = screen.getByRole('list', { name: 'Importante antes de contratar' });
  expect(notices).toHaveClass('reveal-stagger');
  expect(
    within(notices)
      .getAllByRole('listitem')
      .map((item) => item.textContent),
  ).toEqual([
    'Las modificaciones de alimentación o envío se coordinan vía mensajes de WhatsApp, no llamadas.',
    'Para suspender una entrega debes avisar con un mínimo de 24 horas antes.',
    'Es responsabilidad del cliente estar atento a la entrega o coordinar adecuadamente la recepción.',
    'Una vez hecho el pago no se aceptan devoluciones.',
  ]);
});
