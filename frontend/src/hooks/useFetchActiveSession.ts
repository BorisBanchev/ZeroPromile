import { useState, useCallback } from "react";
import sessionsService from "@/src/services/sessions";
import { ActiveSession } from "../types/sessions";
import { useNotificationStore } from "../store/useNotificationStore";
import { useAuthStore } from "../store/useAuthStore";

export const useFetchActiveSession = () => {
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(
    null,
  );
  const [loadingActiveSession, setLoadingActiveSession] =
    useState<boolean>(false);
  const accessToken = useAuthStore((state) => state.accessToken);
  const setError = useNotificationStore((state) => state.setError);

  const fetchActiveSession = useCallback(async () => {
    try {
      if (!accessToken) throw new Error("Not authorized");
      setLoadingActiveSession(true);
      const data = await sessionsService.getActiveSession(accessToken);
      setActiveSession(data);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) setError(error.message);
    } finally {
      setLoadingActiveSession(false);
    }
  }, [accessToken, setError]);

  return { activeSession, loadingActiveSession, fetchActiveSession };
};
