import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { toVoid } from '@/utils/toVoid';
import type { ClientCreateDraft, SubscriptionCreateDraft } from './useClientList';

export function useReviewDraft(id: string | null) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({
      client,
      subscription,
    }: {
      client: ClientCreateDraft;
      subscription: SubscriptionCreateDraft;
    }) => api.post(`/clients/${id}/review`, { client, subscription }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['clients'] }),
  });

  return {
    review: (client: ClientCreateDraft, subscription: SubscriptionCreateDraft): Promise<void> =>
      toVoid(mutation.mutateAsync({ client, subscription })),
    isReviewing: mutation.isPending,
  };
}
