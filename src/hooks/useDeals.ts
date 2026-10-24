import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../services/api";
import type { Deal } from "../types";

export function useDeals(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["deals", params],
    queryFn: async () => {
      const response = await apiClient.getDeals(params);
      return response.data;
    },
  });
}

export function useDeal(id: string) {
  return useQuery({
    queryKey: ["deals", id],
    queryFn: async () => {
      const response = await apiClient.getDeal(id);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateDeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Deal>) => {
      const response = await apiClient.createDeal(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
    },
  });
}

export function useUpdateDeal(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Deal>) => {
      const response = await apiClient.updateDeal(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
      queryClient.invalidateQueries({ queryKey: ["deals", id] });
    },
  });
}

export function useDeleteDeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.deleteDeal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
    },
  });
}
