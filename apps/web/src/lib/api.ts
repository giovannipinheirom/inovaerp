import { useAuthStore } from "@/stores/auth-store";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const { accessToken, logout } = useAuthStore.getState();
  
  const headers = new Headers(options.headers);
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    logout();
    window.location.href = "/login";
  }

  if (!response.ok) {
    throw new Error("Erro na requisição da API");
  }

  return response.json();
}

export const api = {
  get: (endpoint: string, options?: RequestInit) => 
    fetchWithAuth(endpoint, { ...options, method: "GET" }),
  post: (endpoint: string, data: any, options?: RequestInit) => 
    fetchWithAuth(endpoint, { ...options, method: "POST", body: JSON.stringify(data) }),
  patch: (endpoint: string, data: any, options?: RequestInit) => 
    fetchWithAuth(endpoint, { ...options, method: "PATCH", body: JSON.stringify(data) }),
  delete: (endpoint: string, options?: RequestInit) => 
    fetchWithAuth(endpoint, { ...options, method: "DELETE" }),
};
