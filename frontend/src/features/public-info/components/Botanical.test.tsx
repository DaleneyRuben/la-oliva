import { render } from '@testing-library/react';
import { Botanical } from './Botanical';

it('renders a decorative olive branch hidden from assistive technology', () => {
  const { container } = render(<Botanical name="branch" className="left-0 bottom-0" />);
  const image = container.querySelector('img');

  expect(image).toHaveAttribute('alt', '');
  expect(image).toHaveAttribute('aria-hidden', 'true');
  expect(image).toHaveClass('pointer-events-none', 'absolute', 'left-0', 'bottom-0');
});
