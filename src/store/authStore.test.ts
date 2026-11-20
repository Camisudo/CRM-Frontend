import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAuthStore } from "./authStore";
import { apiClient } from "../services/api";

const user = {
  id: "u1",
  email: "a@b.co",
  firstName: "Ada",
  lastName: "Lovelace",
  role: "admin",
  permissions: [],
  createdAt: "",
  updatedAt: "",
} as const;

describe("authStore", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  });

  it("stores token and user on successful login", async () => {
    vi.spyOn(apiClient, "login").mockResolvedValue({
      data: { user, token: "tok-1", expiresIn: 3600 },
    } as any);

    await useAuthStore.getState().login("a@b.co", "pw");

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.token).toBe("tok-1");
    expect(state.user?.email).toBe("a@b.co");
    expect(localStorage.getItem("auth_token")).toBe("tok-1");
    expect(JSON.parse(localStorage.getItem("auth_user")!).id).toBe("u1");
  });

  it("sets the API error message and rethrows on failed login", async () => {
    vi.spyOn(apiClient, "login").mockRejectedValue({
      response: { data: { error: { message: "invalid credentials" } } },
    });

    await expect(useAuthStore.getState().login("a@b.co", "bad")).rejects.toBeDefined();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.error).toBe("invalid credentials");
    expect(state.isLoading).toBe(false);
    expect(localStorage.getItem("auth_token")).toBeNull();
  });

  it("uses a generic message when the server gives none", async () => {
    vi.spyOn(apiClient, "login").mockRejectedValue(new Error("network down"));

    await expect(useAuthStore.getState().login("a", "b")).rejects.toBeDefined();
    expect(useAuthStore.getState().error).toBe("Login failed. Please try again.");
  });

  it("clears local auth state on logout even if the request fails", async () => {
    localStorage.setItem("auth_token", "tok-1");
    localStorage.setItem("auth_user", JSON.stringify(user));
    useAuthStore.setState({ isAuthenticated: true, token: "tok-1", user: user as any });
    vi.spyOn(apiClient, "logout").mockRejectedValue(new Error("offline"));
    vi.spyOn(console, "error").mockImplementation(() => {});

    await useAuthStore.getState().logout();

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(localStorage.getItem("auth_token")).toBeNull();
    expect(localStorage.getItem("auth_user")).toBeNull();
  });
});
