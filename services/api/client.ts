import type { ApiError } from "@/types";

const ML_API_BASE =
  process.env.NEXT_PUBLIC_ML_API_URL ?? "http://localhost:8000";

const DEFAULT_TIMEOUT_MS = 10_000;
const MAX_RETRIES = 3;


export class BackendUnavailableError extends Error {
  constructor(reason?: string) {
    super(reason ?? "Backend unreachable");
    this.name = "BackendUnavailableError";
  }
}


export class ApiResponseError extends Error implements ApiError {
  code: string;
  status: number;

  constructor(message: string, status: number, code = "API_ERROR") {
    super(message);
    this.name = "ApiResponseError";
    this.status = status;
    this.code = code;
  }
}


export class TimeoutError extends Error {
  constructor() {
    super("Request timed out");
    this.name = "TimeoutError";
  }
}

interface FetchOptions extends RequestInit {
  timeoutMs?: number;
}


async function fetchWithTimeout(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, ...fetchOpts } = options;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...fetchOpts,
      signal: controller.signal,
    });
    return response;
  } catch (err) {
    if ((err as Error).name === "AbortError") {
      throw new TimeoutError();
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}


function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


function isNetworkError(err: unknown): boolean {
  if (err instanceof TimeoutError) return true;
  if (err instanceof TypeError) return true;
  if (err instanceof ApiResponseError && err.status >= 500) return true;
  return false;
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
  timeoutMs?: number;
  retries?: number;

  baseUrl?: string;
}


export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    method = "GET",
    body,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    retries = MAX_RETRIES,
    baseUrl = ML_API_BASE,
  } = options;

  const url = `${baseUrl}${path}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const fetchOpts: FetchOptions = {
    method,
    headers,
    timeoutMs,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  };

  let lastError: unknown;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetchWithTimeout(url, fetchOpts);

      if (!response.ok) {
        if (response.status >= 400 && response.status < 500) {
          let message = `HTTP ${response.status}`;
          try {
            const data = await response.json();
            message = data?.detail ?? data?.message ?? message;
          } catch {}
          throw new ApiResponseError(message, response.status);
        }
        throw new ApiResponseError(
          `Server error: ${response.status}`,
          response.status,
          "SERVER_ERROR"
        );
      }

      const data = (await response.json()) as T;
      return data;
    } catch (err) {
      lastError = err;

      if (err instanceof ApiResponseError && err.status < 500) {
        throw err;
      }

      if (attempt < retries - 1) {
        await sleep(Math.pow(2, attempt) * 300);
      }
    }
  }


  if (isNetworkError(lastError)) {
    throw new BackendUnavailableError(
      lastError instanceof Error ? lastError.message : undefined
    );
  }

  throw lastError;
}

export const client = {
  get: <T>(path: string, opts?: Omit<RequestOptions, "method" | "body">) =>
    apiRequest<T>(path, { ...opts, method: "GET" }),

  post: <T>(path: string, body: unknown, opts?: Omit<RequestOptions, "method">) =>
    apiRequest<T>(path, { ...opts, method: "POST", body }),

  delete: <T>(path: string, opts?: Omit<RequestOptions, "method" | "body">) =>
    apiRequest<T>(path, { ...opts, method: "DELETE" }),
};

export { ML_API_BASE };
