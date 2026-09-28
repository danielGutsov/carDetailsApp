import type { AdminUser, AdminVehicle, User, Vehicle, VehicleInput } from "../types";

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`/api${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(body.error ?? `Request failed (${res.status})`, res.status);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  register: (email: string, password: string) =>
    request<User>("/auth/register", { method: "POST", body: JSON.stringify({ email, password }) }),
  login: (email: string, password: string) =>
    request<User>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  logout: () => request<void>("/auth/logout", { method: "POST" }),
  me: () => request<User>("/auth/me"),

  listVehicles: () => request<Vehicle[]>("/vehicles"),
  createVehicle: (data: VehicleInput) =>
    request<Vehicle>("/vehicles", { method: "POST", body: JSON.stringify(data) }),
  updateVehicle: (id: number, data: VehicleInput) =>
    request<Vehicle>(`/vehicles/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteVehicle: (id: number) => request<void>(`/vehicles/${id}`, { method: "DELETE" }),

  adminListVehicles: () => request<AdminVehicle[]>("/admin/vehicles"),
  adminListUsers: () => request<AdminUser[]>("/admin/users"),
};

export { ApiError };
