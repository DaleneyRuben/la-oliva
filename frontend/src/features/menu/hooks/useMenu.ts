import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/services/api';
import type { Menu, MenuDraft } from '@/features/menu/types';

export function useMenu() {
  const qc = useQueryClient();

  const menusQuery = useQuery({
    queryKey: ['menus'],
    queryFn: (): Promise<Menu[]> => api.get<Menu[]>('/menus'),
  });

  const saveMutation = useMutation({
    mutationFn: (drafts: MenuDraft[]) => api.put<Menu[]>('/menus/week', { menus: drafts }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['menus'] });
      toast.success('Semana guardada');
    },
  });

  return {
    menus: menusQuery.data ?? [],
    isLoading: menusQuery.isLoading,
    isSaving: saveMutation.isPending,
    saveWeek: (drafts: MenuDraft[]): Promise<Menu[]> => saveMutation.mutateAsync(drafts),
    error: saveMutation.error,
  };
}
