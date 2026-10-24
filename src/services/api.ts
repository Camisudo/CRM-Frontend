import axios, { AxiosError } from "axios";
import type { AxiosInstance } from "axios";
import type {
  AuthResponse,
  Contact,
  Deal,
  Task,
  Activity,
  Note,
  PaginatedResponse,
  DashboardMetrics,
} from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/v1";

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
      // The API spec uses comma-separated lists (?status=open,in_progress),
      // not repeated keys or bracket notation. Drop empty values too.
      paramsSerializer: {
        serialize: (params: Record<string, unknown>) => {
          const search = new URLSearchParams();
          Object.entries(params).forEach(([key, value]) => {
            if (value === undefined || value === null || value === "") return;
            if (Array.isArray(value)) {
              if (value.length > 0) search.append(key, value.join(","));
              return;
            }
            search.append(key, String(value));
          });
          return search.toString();
        },
      },
    });

    // Add token to requests
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle 401 responses (token expired)
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("auth_token");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth
  login(email: string, password: string) {
    return this.client.post<AuthResponse>("/auth/login", { email, password });
  }

  logout() {
    return this.client.post("/auth/logout");
  }

  refreshToken() {
    return this.client.post<AuthResponse>("/auth/refresh");
  }

  // Contacts
  getContacts(params?: Record<string, any>) {
    return this.client.get<PaginatedResponse<Contact>>("/contacts", {
      params,
    });
  }

  getContact(id: string) {
    return this.client.get<Contact>(`/contacts/${id}`);
  }

  createContact(data: Partial<Contact>) {
    return this.client.post<Contact>("/contacts", data);
  }

  updateContact(id: string, data: Partial<Contact>) {
    return this.client.patch<Contact>(`/contacts/${id}`, data);
  }

  deleteContact(id: string) {
    return this.client.delete(`/contacts/${id}`);
  }

  // Deals
  getDeals(params?: Record<string, any>) {
    return this.client.get<PaginatedResponse<Deal>>("/deals", { params });
  }

  getDeal(id: string) {
    return this.client.get<Deal>(`/deals/${id}`);
  }

  createDeal(data: Partial<Deal>) {
    return this.client.post<Deal>("/deals", data);
  }

  updateDeal(id: string, data: Partial<Deal>) {
    return this.client.patch<Deal>(`/deals/${id}`, data);
  }

  deleteDeal(id: string) {
    return this.client.delete(`/deals/${id}`);
  }

  // Tasks
  getTasks(params?: Record<string, any>) {
    return this.client.get<PaginatedResponse<Task>>("/tasks", { params });
  }

  getTask(id: string) {
    return this.client.get<Task>(`/tasks/${id}`);
  }

  createTask(data: Partial<Task>) {
    return this.client.post<Task>("/tasks", data);
  }

  updateTask(id: string, data: Partial<Task>) {
    return this.client.patch<Task>(`/tasks/${id}`, data);
  }

  deleteTask(id: string) {
    return this.client.delete(`/tasks/${id}`);
  }

  // Activities
  getActivities(params?: Record<string, any>) {
    return this.client.get<PaginatedResponse<Activity>>("/activities", {
      params,
    });
  }

  getActivity(id: string) {
    return this.client.get<Activity>(`/activities/${id}`);
  }

  // Notes
  getContactNotes(contactId: string, params?: Record<string, any>) {
    return this.client.get<PaginatedResponse<Note>>(
      `/contacts/${contactId}/notes`,
      { params }
    );
  }

  createContactNote(contactId: string, data: Partial<Note>) {
    return this.client.post<Note>(`/contacts/${contactId}/notes`, data);
  }

  updateNote(id: string, data: Partial<Note>) {
    return this.client.patch<Note>(`/notes/${id}`, data);
  }

  deleteNote(id: string) {
    return this.client.delete(`/notes/${id}`);
  }

  // Dashboard
  getDashboardMetrics(params?: Record<string, any>) {
    return this.client.get<DashboardMetrics>("/dashboard/metrics", { params });
  }

  getMyTasks(params?: Record<string, any>) {
    return this.client.get<PaginatedResponse<Task>>("/dashboard/my-tasks", {
      params,
    });
  }
}

export const apiClient = new ApiClient();
