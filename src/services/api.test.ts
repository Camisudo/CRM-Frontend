import { describe, it, expect, beforeEach, vi } from "vitest";
import { apiClient } from "./api";

// The client's request interceptor runs before each request. We capture
// the outgoing config by swapping the adapter on the underlying axios instance.
type Captured = { url?: string; params?: unknown; headers: Record<string, any> };

function captureNextRequest(): { last: () => Captured | undefined } {
  let last: Captured | undefined;
  const client = (apiClient as any).client;
  client.defaults.adapter = async (config: any) => {
    last = {
      url: config.url,
      params: config.params,
      headers: config.headers,
    };
    // Build the serialized URL the same way axios would, so we can assert on it.
    const serialize = config.paramsSerializer?.serialize ?? config.paramsSerializer;
    const query = config.params && serialize ? serialize(config.params) : "";
    last.url = `${config.baseURL}${config.url}${query ? `?${query}` : ""}`;
    return { data: {}, status: 200, statusText: "OK", headers: {}, config };
  };
  return { last: () => last };
}

describe("apiClient", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("attaches the bearer token from localStorage", async () => {
    localStorage.setItem("auth_token", "abc123");
    const cap = captureNextRequest();

    await apiClient.getContacts();

    expect(cap.last()?.headers.Authorization).toBe("Bearer abc123");
  });

  it("omits Authorization when no token is stored", async () => {
    const cap = captureNextRequest();

    await apiClient.getContacts();

    expect(cap.last()?.headers.Authorization).toBeUndefined();
  });

  it("serializes array params as comma-separated values", async () => {
    const cap = captureNextRequest();

    await apiClient.getTasks({ status: ["open", "in_progress"], priority: "high" });

    const url = cap.last()?.url ?? "";
    expect(url).toContain("status=open%2Cin_progress");
    expect(url).toContain("priority=high");
  });

  it("drops undefined, null, empty-string, and empty-array params", async () => {
    const cap = captureNextRequest();

    await apiClient.getDeals({ search: "", stage: [], owner: undefined, minValue: null, maxValue: 500 });

    const url = cap.last()?.url ?? "";
    expect(url).toContain("maxValue=500");
    expect(url).not.toContain("search=");
    expect(url).not.toContain("stage=");
    expect(url).not.toContain("owner=");
    expect(url).not.toContain("minValue=");
  });
});
