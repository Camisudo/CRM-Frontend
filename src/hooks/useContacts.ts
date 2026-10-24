import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../services/api";
import type { Contact } from "../types";

export function useContacts(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["contacts", params],
    queryFn: async () => {
      const response = await apiClient.getContacts(params);
      return response.data;
    },
  });
}

export function useContact(id: string) {
  return useQuery({
    queryKey: ["contacts", id],
    queryFn: async () => {
      const response = await apiClient.getContact(id);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Contact>) => {
      const response = await apiClient.createContact(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
}

export function useUpdateContact(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Contact>) => {
      const response = await apiClient.updateContact(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      queryClient.invalidateQueries({ queryKey: ["contacts", id] });
    },
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.deleteContact(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
}
