import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { User, LoginCredentials, RegisterCredentials } from "../types/auth";

const API_URL: string | undefined = process.env.EXPO_PUBLIC_BACKEND_URL;

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
}

export const useAuthStore = create<AuthState>((set) => ({
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login Failed");
      }

      const { user, accessToken, refreshToken } = data.data;

      await SecureStore.setItemAsync("accessToken", accessToken);
      await SecureStore.setItemAsync("refreshToken", refreshToken);

      set({ user, accessToken, refreshToken });
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      const { user, accessToken, refreshToken } = data.data;

      await SecureStore.setItemAsync("accessToken", accessToken);
      await SecureStore.setItemAsync("refreshToken", refreshToken);

      set({ user, accessToken, refreshToken });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");

    set({ user: null, accessToken: null, refreshToken: null });
  },

  initialize: async () => {
    try {
      const accessToken = await SecureStore.getItemAsync("accessToken");
      const refreshToken = await SecureStore.getItemAsync("refreshToken");

      if (accessToken && refreshToken) {
        set({ accessToken, refreshToken });
      }
    } catch (error: unknown) {
      if (error instanceof Error) console.log(error.message);
    } finally {
      set({ isInitialized: true });
    }
  },
}));
