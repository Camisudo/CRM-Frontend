import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../services/api";

export function useDashboardMetrics(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["dashboard-metrics", params],
    queryFn: async () => {
      const response = await apiClient.getDashboardMetrics(params);
      return response.data;
    },
  });
}

export function useMyTasks() {
  return useQuery({
    queryKey: ["my-tasks"],
    queryFn: async () => {
      const response = await apiClient.getMyTasks({ status: ["open", "in_progress"] });
      return response.data;
    },
  });
}
