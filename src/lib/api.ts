import type {
  Business,
  Campaign,
  CreateCampaignInput,
  UpsertBusinessInput,
} from "./api-types";

/**
 * Base URL of the realtime backend. Resolved at build time via the
 * `NEXT_PUBLIC_API_URL` env var (set in Vercel for production; set in
 * `.env.local` to `http://localhost:4000` for local dev).
 */
export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`api_${res.status}: ${body || res.statusText}`);
  }
  return (await res.json()) as T;
}

export async function upsertBusiness(
  input: UpsertBusinessInput,
): Promise<Business> {
  const { business } = await request<{ business: Business }>("/businesses", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return business;
}

export type CreateCampaignResult = {
  campaign: Campaign;
  /** Nearby users that had an open EventSource at broadcast time. */
  delivered: number;
};

export async function createCampaign(
  input: CreateCampaignInput,
): Promise<CreateCampaignResult> {
  return request<CreateCampaignResult>("/campaigns", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
