import { create } from "zustand";

type NotificationType = "success" | "error";

interface Notification {
  message: string;
  type: NotificationType;
}

interface NotificationState {
  notification: Notification | null;
  setSuccess: (message: string) => void;
  setError: (message: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notification: null,

  setSuccess: (message: string) => {
    set({ notification: { message, type: "success" } });

    setTimeout(() => {
      set({ notification: null });
    }, 5000);
  },

  setError: (message: string) => {
    set({ notification: { message, type: "error" } });

    setTimeout(() => {
      set({ notification: null });
    }, 5000);
  },
}));
