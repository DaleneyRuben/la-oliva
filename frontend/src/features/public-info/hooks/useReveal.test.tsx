import { act, render, screen } from '@testing-library/react';
import { useReveal } from './useReveal';

type Callback = (entries: Partial<IntersectionObserverEntry>[]) => void;

function Probe({ stagger = false }: { stagger?: boolean }) {
  const reveal = useReveal<HTMLDivElement>({ stagger });

  return (
    <div
      ref={reveal.ref}
      className={`card ${reveal.className}`}
      data-testid="probe"
      data-visible={reveal.visible}
    >
      hola
    </div>
  );
}

describe('useReveal', () => {
  const originalObserver = window.IntersectionObserver;
  let callback: Callback | undefined;
  const observe = jest.fn();
  const unobserve = jest.fn();
  const disconnect = jest.fn();

  beforeEach(() => {
    callback = undefined;
    observe.mockClear();
    unobserve.mockClear();
    disconnect.mockClear();
    window.IntersectionObserver = jest.fn((cb: Callback) => {
      callback = cb;
      return { observe, unobserve, disconnect };
    }) as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    window.IntersectionObserver = originalObserver;
  });

  it('starts hidden and becomes visible once the element enters the viewport', () => {
    render(<Probe />);

    const probe = screen.getByTestId('probe');
    expect(probe).toHaveClass('card', 'reveal');
    expect(probe).not.toHaveClass('is-visible');
    expect(probe).toHaveAttribute('data-visible', 'false');
    expect(observe).toHaveBeenCalledWith(probe);
    expect(window.IntersectionObserver).toHaveBeenCalledWith(expect.any(Function), {
      threshold: 0.15,
    });

    act(() => {
      callback?.([
        { isIntersecting: false, boundingClientRect: { bottom: 1200 } as DOMRectReadOnly },
      ]);
    });
    expect(probe).not.toHaveClass('is-visible');

    act(() => {
      callback?.([
        { isIntersecting: true, boundingClientRect: { bottom: 600 } as DOMRectReadOnly },
      ]);
    });
    expect(probe).toHaveClass('reveal', 'is-visible');
    expect(probe).toHaveAttribute('data-visible', 'true');
    expect(disconnect).toHaveBeenCalledTimes(1);
  });

  it('treats an element already scrolled past as revealed', () => {
    render(<Probe />);

    act(() => {
      callback?.([
        { isIntersecting: false, boundingClientRect: { bottom: -40 } as DOMRectReadOnly },
      ]);
    });

    expect(screen.getByTestId('probe')).toHaveClass('is-visible');
  });

  it('uses the staggered variant for card grids', () => {
    render(<Probe stagger />);

    expect(screen.getByTestId('probe')).toHaveClass('reveal-stagger');
    expect(screen.getByTestId('probe')).not.toHaveClass('reveal');
  });

  it('shows the element immediately when the browser has no IntersectionObserver', () => {
    window.IntersectionObserver = undefined as unknown as typeof IntersectionObserver;

    render(<Probe />);

    expect(screen.getByTestId('probe')).toHaveClass('reveal', 'is-visible');
  });

  it('stops observing on unmount', () => {
    const { unmount } = render(<Probe />);

    unmount();

    expect(disconnect).toHaveBeenCalledTimes(1);
  });
});
