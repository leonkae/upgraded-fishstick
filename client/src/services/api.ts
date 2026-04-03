import { APIError } from "@/types";

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

interface FetchOptions {
  method?: RequestMethod;
  headers?: Record<string, string>;
  body?: unknown; // Fixed: Changed 'any' to 'unknown' to resolve Line 8 error
}

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005/api/v1";

export class APIClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl: string = BASE_URL, defaultHeaders = {}) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      ...defaultHeaders,
    };
  }

  async request<T>(
    endpoint: string, // Corrected typo: endppoint -> endpoint
    { method, headers = {}, body }: FetchOptions
  ) {
    const config: RequestInit = {
      method,
      headers: {
        ...this.defaultHeaders,
        ...headers,
      },
      credentials: "include",
    };

    // Only add body if it's not a GET request and body is provided
    if (method !== "GET" && body !== undefined) {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);

      // Handle empty responses or non-JSON responses gracefully
      const responseJSON = (await response.json()) as {
        success: boolean;
        data?: T;
        errors?: APIError[];
      };

      if (
        !responseJSON.success &&
        responseJSON.errors &&
        responseJSON.errors.length > 0
      ) {
        throw new Error(responseJSON.errors[0].message);
      }

      return { data: responseJSON.data as T, response };
    } catch (e) {
      throw e;
    }
  }

  get<T>(endpoint: string, options: Omit<FetchOptions, "method"> = {}) {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  post<T>(
    endpoint: string,
    body?: unknown,
    options: Omit<FetchOptions, "method" | "body"> = {}
  ) {
    return this.request<T>(endpoint, { ...options, method: "POST", body });
  }

  put<T>(
    endpoint: string,
    body?: unknown,
    options: Omit<FetchOptions, "method" | "body"> = {}
  ) {
    return this.request<T>(endpoint, { ...options, method: "PUT", body });
  }

  delete<T>(endpoint: string, options: Omit<FetchOptions, "method"> = {}) {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

const fetapi = new APIClient();

export { fetapi };
