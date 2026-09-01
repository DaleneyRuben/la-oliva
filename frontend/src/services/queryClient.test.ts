import { toast } from 'sonner';
import { queryClient } from '@/services/queryClient';

jest.mock('sonner', () => ({ toast: { error: jest.fn() } }));

beforeEach(() => {
  jest.clearAllMocks();
  queryClient.clear();
});

describe('queryClient', () => {
  it('shows a fallback error for mutations without local error handling', async () => {
    const error = new Error('No se pudo guardar');
    const mutation = queryClient.getMutationCache().build(queryClient, {
      mutationFn: () => Promise.reject(error),
    });

    await expect(mutation.execute(undefined)).rejects.toThrow('No se pudo guardar');

    expect(toast.error).toHaveBeenCalledWith('No se pudo guardar');
  });
});
