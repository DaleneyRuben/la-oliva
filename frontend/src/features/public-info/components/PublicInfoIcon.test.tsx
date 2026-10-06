import { render } from '@testing-library/react';
import { PUBLIC_INFO_ICON_NAMES, PublicInfoIcon } from './PublicInfoIcon';

it('draws a decorative stroke icon for every public-info glyph', () => {
  PUBLIC_INFO_ICON_NAMES.forEach((name) => {
    const { container, unmount } = render(<PublicInfoIcon name={name} size={20} />);
    const svg = container.querySelector('svg');

    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('width', '20');
    expect(svg).toHaveAttribute('stroke', 'currentColor');
    unmount();
  });
});

it('covers the glyphs the slides use that the shared icon set lacks', () => {
  expect(PUBLIC_INFO_ICON_NAMES).toEqual(
    expect.arrayContaining([
      'whatsapp',
      'file-text',
      'tag',
      'heart',
      'scales',
      'dumbbell',
      'heartbeat',
      'mother',
      'credit-card',
      'user',
      'chat',
    ]),
  );
});
