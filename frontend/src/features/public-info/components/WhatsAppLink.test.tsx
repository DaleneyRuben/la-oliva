import { render, screen } from '@testing-library/react';
import { WhatsAppLink } from './WhatsAppLink';

it('renders a pill link to WhatsApp that opens in a new tab', () => {
  render(<WhatsAppLink href="https://wa.link/mrujyv">Quiero contratar</WhatsAppLink>);

  const link = screen.getByRole('link', { name: 'Quiero contratar' });
  expect(link).toHaveAttribute('href', 'https://wa.link/mrujyv');
  expect(link).toHaveAttribute('target', '_blank');
  expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  expect(link).toHaveClass('rounded-full', 'active:scale-[0.98]');
  expect(link.querySelectorAll('svg')).toHaveLength(2);
});

it('swaps the WhatsApp glyph for another leading icon when asked', () => {
  render(
    <WhatsAppLink href="https://wa.link/0jp5dy" icon="pin">
      Consultar mi zona
    </WhatsAppLink>,
  );

  const link = screen.getByRole('link', { name: 'Consultar mi zona' });
  expect(link.querySelectorAll('svg')).toHaveLength(2);
});
