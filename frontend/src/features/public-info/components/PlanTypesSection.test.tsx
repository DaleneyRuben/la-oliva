import { fireEvent, render, screen } from '@testing-library/react';
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
  expect(
    screen.getByRole('button', { name: 'Además contamos con plan de Almuerzos y/o Cena' }),
  ).toHaveClass('bg-public-olive');
  expect(document.getElementById('tipos-de-plan')).not.toBeNull();
  expect(screen.getByRole('list')).toHaveClass('reveal-stagger');
  expect(screen.getAllByRole('listitem')[0]).toHaveClass('hover:-translate-y-0.5');
});

it('opens the lunch and dinner plan modal from the highlighted button and closes it', () => {
  render(<PlanTypesSection />);

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  fireEvent.click(
    screen.getByRole('button', { name: 'Además contamos con plan de Almuerzos y/o Cena' }),
  );
  expect(screen.getByRole('heading', { name: 'Plan de Almuerzos y/o Cena' })).toBeInTheDocument();
  expect(screen.getByText('1 / 2')).toBeInTheDocument();
  expect(screen.getByRole('img', { name: 'Plan Solo Almuerzo' })).toBeInTheDocument();
  expect(screen.getByAltText('Plan Almuerzo + Cena')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Cerrar' }));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});
