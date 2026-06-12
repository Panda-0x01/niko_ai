import Cookies from "js-cookie";
import { api } from "./api";
import type { LoginInput, RegisterInput, AuthResponse, User } from "@/types";

export async function login(data: LoginInput): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>("/auth/login", data);
  saveTokens(res.data);
  return res.data;
}

export async function register(data: RegisterInput): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>("/auth/register", data);
  saveTokens(res.data);
  return res.data;
}

export async function logout(): Promise<void> {
  try {
    await api.post("/auth/logout");
  } finally {
    clearTokens();
  }
}

export async function getMe(): Promise<User> {
  const res = await api.get<User>("/users/me");
  return res.data;
}

export function saveTokens(data: AuthResponse): void {
  Cookies.set("access_token", data.access_token, { expires: 1, sameSite: "strict" });
  Cookies.set("refresh_token", data.refresh_token, { expires: 7, sameSite: "strict" });
}

export function clearTokens(): void {
  Cookies.remove("access_token");
  Cookies.remove("refresh_token");
}

export function isAuthenticated(): boolean {
  return !!Cookies.get("access_token");
}

export function getAccessToken(): string | undefined {
  return Cookies.get("access_token");
}
