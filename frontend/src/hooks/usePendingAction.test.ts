import { act, renderHook } from '@testing-library/react';
import { usePendingAction } from '@/hooks/usePendingAction';

const deferred = () => {
  let resolve!: () => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<void>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

describe('usePendingAction', () => {
  it('starts idle', () => {
    const { result } = renderHook(() => usePendingAction());

    expect(result.current.pending).toBe(false);
  });

  // A double click fires both clicks before React re-renders the button as disabled, so the guard
  // has to hold before any render happens.
  it('runs the action once when called twice before a re-render', async () => {
    const { result } = renderHook(() => usePendingAction());
    const request = deferred();
    const action = jest.fn(() => request.promise);

    act(() => {
      result.current.run(action);
      result.current.run(action);
    });
    expect(action).toHaveBeenCalledTimes(1);

    await act(async () => request.resolve());
  });

  it('is pending while the action runs and idle once it settles', async () => {
    const { result } = renderHook(() => usePendingAction());
    const request = deferred();

    act(() => {
      result.current.run(() => request.promise);
    });
    expect(result.current.pending).toBe(true);

    await act(async () => request.resolve());
    expect(result.current.pending).toBe(false);
  });

  it('allows a retry after the action fails, and passes the error on', async () => {
    const { result } = renderHook(() => usePendingAction());
    const request = deferred();
    let outcome: Promise<unknown> = Promise.resolve();

    act(() => {
      outcome = result.current.run(() => request.promise);
    });
    await act(async () => {
      request.reject(new Error('server error'));
      await expect(outcome).rejects.toThrow('server error');
    });
    expect(result.current.pending).toBe(false);

    const retry = jest.fn().mockResolvedValue(undefined);
    await act(async () => {
      await result.current.run(retry);
    });
    expect(retry).toHaveBeenCalledTimes(1);
  });

  it('returns the action result', async () => {
    const { result } = renderHook(() => usePendingAction());

    let value: string | undefined;
    await act(async () => {
      value = await result.current.run(async () => 'saved');
    });

    expect(value).toBe('saved');
  });
});
