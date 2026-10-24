import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../services/api";

export function useActivities(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["activities", params],
    queryFn: async () => {
      const response = await apiClient.getActivities(params);
      return response.data;
    },
  });
}
