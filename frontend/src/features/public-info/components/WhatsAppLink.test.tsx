import { render, screen } from '@testing-library/react';
import { WHATSAPP_URL } from '@/constants/contact.constants';
import { WhatsAppLink } from './WhatsAppLink';

it('renders a pill link to WhatsApp that opens in a new tab', () => {
  render(<WhatsAppLink>Quiero contratar</WhatsAppLink>);

  const link = screen.getByRole('link', { name: 'Quiero contratar' });
  expect(link).toHaveAttribute('href', WHATSAPP_URL);
  expect(link).toHaveAttribute('target', '_blank');
  expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  expect(link).toHaveClass('rounded-full');
  expect(link.querySelectorAll('svg')).toHaveLength(2);
});

it('swaps the WhatsApp glyph for another leading icon when asked', () => {
  render(<WhatsAppLink icon="pin">Consultar mi zona</WhatsAppLink>);

  const link = screen.getByRole('link', { name: 'Consultar mi zona' });
  expect(link.querySelectorAll('svg')).toHaveLength(2);
});
