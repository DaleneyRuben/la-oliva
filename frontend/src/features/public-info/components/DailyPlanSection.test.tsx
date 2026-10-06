import { render, screen } from '@testing-library/react';
import { DailyPlanSection } from './DailyPlanSection';

it('renders the seven meals with their photos shown whole', () => {
  render(<DailyPlanSection />);

  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
    'Tu alimentación diaria, resuelta',
  );
  expect(screen.getAllByRole('figure').map((figure) => figure.textContent)).toEqual([
    'Desayuno',
    'Merienda AM',
    'Ensalada',
    'Almuerzo',
    'Merienda PM',
    'Cena',
    'Jugo vitamínico',
  ]);
  screen.getAllByRole('img').forEach((img) => {
    expect(img).toHaveClass('object-contain');
  });
  expect(screen.getByText('5 o 6 comidas diarias')).toBeInTheDocument();
  expect(screen.getByText('+ jugo vitamínico')).toBeInTheDocument();
  expect(screen.getByText('de lunes a viernes')).toBeInTheDocument();
  expect(document.getElementById('plan-completo')).not.toBeNull();
});
