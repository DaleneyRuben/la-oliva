import { renderHook } from '@testing-library/react';
import { usePreloadImages } from './usePreloadImages';

describe('usePreloadImages', () => {
  const OriginalImage = window.Image;
  let requested: string[];

  beforeEach(() => {
    requested = [];
    window.Image = jest.fn(() => ({
      set src(value: string) {
        requested.push(value);
      },
    })) as unknown as typeof Image;
  });

  afterEach(() => {
    window.Image = OriginalImage;
  });

  it('waits until it is told to start', () => {
    renderHook(() => usePreloadImages(['uno.webp', 'dos.webp'], false));

    expect(requested).toEqual([]);
  });

  it('requests every image once it starts, and only once', () => {
    const { rerender } = renderHook(
      ({ start }) => usePreloadImages(['uno.webp', 'dos.webp'], start),
      {
        initialProps: { start: false },
      },
    );

    rerender({ start: true });
    rerender({ start: true });

    expect(requested).toEqual(['uno.webp', 'dos.webp']);
  });
});
