import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../services/api";
import { TaskStatus } from "../types";
import type { Task } from "../types";

export function useTasks(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["tasks", params],
    queryFn: async () => {
      const response = await apiClient.getTasks(params);
      return response.data;
    },
  });
}

export function useTask(id: string) {
  return useQuery({
    queryKey: ["tasks", id],
    queryFn: async () => {
      const response = await apiClient.getTask(id);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useMyTasks(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["my-tasks", params],
    queryFn: async () => {
      const response = await apiClient.getMyTasks(params);
      return response.data;
    },
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Task>) => {
      const response = await apiClient.createTask(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["my-tasks"] });
    },
  });
}

export function useUpdateTask(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Task>) => {
      const response = await apiClient.updateTask(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["my-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["tasks", id] });
    },
  });
}

export function useToggleTaskComplete() {
  const queryClient = useQueryClient();

  return useMutation({
    meta: { errorMessage: "Could not update task" },
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const response = await apiClient.updateTask(id, {
        status: completed ? TaskStatus.Completed : TaskStatus.Open,
        completedAt: completed ? new Date().toISOString() : undefined,
      } as Partial<Task>);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["my-tasks"] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    meta: { successMessage: "Task deleted", errorMessage: "Could not delete task" },
    mutationFn: (id: string) => apiClient.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["my-tasks"] });
    },
  });
}
