import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import {
  User,
  LoginCredentials,
  RegisterCredentials,
  LoginResponse,
  RegisterResponse,
  RefreshTokenResponse,
} from "../types/auth";
import { useNotificationStore } from "./useNotificationStore";
import { API_URL } from "../config/apiUrl";
import { ErrorResponse } from "../types/error";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isInitialized: boolean;

  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  refreshAccessToken: () => Promise<string>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  isInitialized: false,

  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data: LoginResponse | ErrorResponse = await response.json();

      if ("error" in data) {
        throw new Error(data.error || "Login Failed");
      }
      if (!response.ok) {
        throw new Error("Login failed");
      }

      const { user, accessToken, refreshToken } = data.data;

      await SecureStore.setItemAsync("accessToken", accessToken);
      await SecureStore.setItemAsync("refreshToken", refreshToken);

      set({ user, accessToken, refreshToken });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      useNotificationStore.getState().setError(errorMessage);
      return;
    } finally {
      set({ isLoading: false });
    }
  },
  register: async (credentials) => {
    set({ isLoading: true });

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data: RegisterResponse | ErrorResponse = await response.json();

      if ("error" in data) {
        throw new Error(data.error || "Registration Failed");
      }

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const { user, accessToken, refreshToken } = data.data;

      await SecureStore.setItemAsync("accessToken", accessToken);
      await SecureStore.setItemAsync("refreshToken", refreshToken);

      set({ user, accessToken, refreshToken });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Registration failed";
      useNotificationStore.getState().setError(errorMessage);
      return;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");

    set({ user: null, accessToken: null, refreshToken: null });
    useNotificationStore.getState().setSuccess("Logged out successfully");
  },

  initialize: async () => {
    try {
      const accessToken = await SecureStore.getItemAsync("accessToken");
      const refreshToken = await SecureStore.getItemAsync("refreshToken");

      if (accessToken && refreshToken) {
        set({ accessToken, refreshToken });
      }
    } catch (error: unknown) {
      if (error instanceof Error) console.error(error);
    } finally {
      set({ isInitialized: true });
    }
  },
  refreshAccessToken: async (): Promise<string> => {
    try {
      const refreshToken = get().refreshToken;
      if (!refreshToken) {
        throw new Error("No refresh token");
      }

      const response = await fetch(`${API_URL}/auth/refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      const data: RefreshTokenResponse | ErrorResponse = await response.json();

      if ("error" in data) {
        throw new Error(data.error || "Failed to refresh access token");
      }

      if (!response.ok) {
        throw new Error("Failed to refresh access token");
      }

      const newAccessToken: string = data.data.accessToken;
      await SecureStore.setItemAsync("accessToken", newAccessToken);
      set({ accessToken: newAccessToken });
      return newAccessToken;
    } catch (error: unknown) {
      await get().logout();

      const message =
        error instanceof Error
          ? error.message
          : "Session expired, please log in again";

      useNotificationStore.getState().setError(message);
      throw new Error(message);
    }
  },
}));
