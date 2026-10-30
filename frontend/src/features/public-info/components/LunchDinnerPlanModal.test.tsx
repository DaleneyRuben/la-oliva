import { fireEvent, render, screen } from '@testing-library/react';
import { LunchDinnerPlanModal } from './LunchDinnerPlanModal';

const IMAGES = [
  { src: 'uno.webp', alt: 'Plan uno' },
  { src: 'dos.webp', alt: 'Plan dos' },
];

it('shows the plan title, its image and the WhatsApp call to action', () => {
  render(<LunchDinnerPlanModal images={[IMAGES[0]]} onClose={jest.fn()} />);

  expect(screen.getByRole('dialog')).toBeInTheDocument();
  expect(screen.getByText('Además contamos con')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Plan de Almuerzos y/o Cena' })).toBeInTheDocument();
  expect(screen.getByRole('img', { name: 'Plan uno' })).toHaveAttribute('src', 'uno.webp');

  const cta = screen.getByRole('link', { name: 'Quiero contratar un plan' });
  expect(cta).toHaveAttribute('href', 'https://wa.link/mrujyv');
  expect(cta).toHaveAttribute('target', '_blank');
  expect(cta).toHaveClass('bg-public-olive');
});

it('hides the carousel controls when there is a single image', () => {
  render(<LunchDinnerPlanModal images={[IMAGES[0]]} onClose={jest.fn()} />);

  expect(screen.queryByRole('button', { name: 'Imagen siguiente' })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Imagen anterior' })).not.toBeInTheDocument();
});

it('steps through the images with the arrows and wraps around', () => {
  render(<LunchDinnerPlanModal images={IMAGES} onClose={jest.fn()} />);

  expect(screen.getByText('1 / 2')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Imagen siguiente' }));
  expect(screen.getByText('2 / 2')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Imagen siguiente' }));
  expect(screen.getByText('1 / 2')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Imagen anterior' }));
  expect(screen.getByText('2 / 2')).toBeInTheDocument();
});

it('jumps to an image from its dot', () => {
  render(<LunchDinnerPlanModal images={IMAGES} onClose={jest.fn()} />);

  fireEvent.click(screen.getByRole('button', { name: 'Ver imagen 2' }));

  expect(screen.getByText('2 / 2')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Ver imagen 2' })).toHaveAttribute(
    'aria-current',
    'true',
  );
});

it('closes from the close button', () => {
  const onClose = jest.fn();
  render(<LunchDinnerPlanModal images={IMAGES} onClose={onClose} />);

  fireEvent.click(screen.getByRole('button', { name: 'Cerrar' }));

  expect(onClose).toHaveBeenCalled();
});

it('picks an image from its thumbnail', () => {
  render(<LunchDinnerPlanModal images={IMAGES} onClose={jest.fn()} />);

  const thumbnail = screen.getByRole('button', { name: 'Ver Plan dos' });
  expect(thumbnail.parentElement).toHaveClass('hidden', 'md:grid');
  fireEvent.click(thumbnail);

  expect(screen.getByText('2 / 2')).toBeInTheDocument();
  expect(thumbnail).toHaveAttribute('aria-current', 'true');
  expect(screen.getByRole('button', { name: 'Ver Plan uno' })).toHaveAttribute(
    'aria-current',
    'false',
  );
});

it('hides the thumbnails when there is a single image', () => {
  render(<LunchDinnerPlanModal images={[IMAGES[0]]} onClose={jest.fn()} />);

  expect(screen.queryByRole('button', { name: 'Ver Plan uno' })).not.toBeInTheDocument();
});
