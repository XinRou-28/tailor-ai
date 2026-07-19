const USE_MOCKS = false; // flip to false at Day 2 integration checkpoint
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api";

export async function apiGet<T>(path: string, mockData: T): Promise<T> {
  if (USE_MOCKS) return mockData;
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message ?? "Request failed");
  }
  return res.json();
}

export async function apiPost<T>(path: string, body: object): Promise<T> {
  if (USE_MOCKS) {
    return { customer_id: "mock", outcome: (body as any).outcome, recorded_at: new Date().toISOString() } as T;
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message ?? "Request failed");
  }
  return res.json();
}