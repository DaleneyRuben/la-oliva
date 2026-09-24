import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { toVoid } from '@/utils/toVoid';
import api from '@/services/api';
import type {
  ClientCreateDraft,
  SubscriptionCreateDraft,
} from '@/features/clients/hooks/useClientList';

export function useCreateClient() {
  const qc = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async ({
      client,
      subscription,
    }: {
      client: ClientCreateDraft;
      subscription: SubscriptionCreateDraft;
    }) => api.post('/clients', { client, subscription }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Cliente registrado correctamente');
    },
  });

  return {
    isCreating: createMutation.isPending,
    create: (client: ClientCreateDraft, subscription: SubscriptionCreateDraft): Promise<void> =>
      toVoid(createMutation.mutateAsync({ client, subscription })),
  };
}
