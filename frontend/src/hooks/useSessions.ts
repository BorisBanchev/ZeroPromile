import sessionsService from "@/src/services/sessions";
import { useCallback, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useNotificationStore } from "../store/useNotificationStore";
import { useFocusEffect } from "expo-router";
import { Session } from "../types/sessions";

export const useSessions = () => {
  const [sessions, setSessions] = useState<Session[] | null>(null);

  const accessToken = useAuthStore((state) => state.accessToken);
  const setError = useNotificationStore((state) => state.setError);

  const fetchSessions = useCallback(async () => {
    if (!accessToken) {
      setError("Not authorized to fetch sessions");
      return;
    }

    try {
      const response = await sessionsService.getSessions(accessToken);
      setSessions(response.data.sessions);
    } catch (error) {
      console.error("Failed to fetch sessions", error);
    }
  }, [accessToken, setError]);

  useFocusEffect(
    useCallback(() => {
      fetchSessions();
    }, [fetchSessions]),
  );

  const totalSessions = sessions?.length ?? 0;

  const thisMonthSessions =
    sessions?.filter((session) => {
      const sessionDate = new Date(session.startedAt);
      const now = new Date();

      return (
        sessionDate.getFullYear() === now.getFullYear() &&
        sessionDate.getMonth() === now.getMonth()
      );
    }).length ?? 0;

  return {
    sessions,
    refetchSessions: fetchSessions,
    totalSessions,
    thisMonthSessions,
  };
};
