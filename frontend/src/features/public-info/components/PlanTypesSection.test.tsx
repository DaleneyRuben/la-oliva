import { render, screen } from '@testing-library/react';
import { PlanTypesSection } from './PlanTypesSection';

it('renders the five plan types with their meal counts', () => {
  render(<PlanTypesSection />);

  expect(screen.getByRole('heading', { name: 'Nuestros planes' })).toBeInTheDocument();
  expect(screen.getByText('Elige el plan que se adapta a ti')).toBeInTheDocument();
  expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual([
    'Reductor5 comidas',
    'A medida5 comidas',
    'Incremento de masa6 comidas',
    'Tratamiento médico5 comidas',
    'Futura mamá o lactante6 comidas',
  ]);
  expect(screen.getByText('Además contamos con plan de Almuerzos y/o Cena')).toBeInTheDocument();
  expect(document.getElementById('tipos-de-plan')).not.toBeNull();
});
