import { View } from "react-native";
import SessionsCountCard from "./SessionsCountCard";
import { useCallback, useState } from "react";
import { SessionSummary } from "@/src/types/sessions";
import { useFocusEffect } from "expo-router";
import sessionsService from "@/src/services/sessions";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useNotificationStore } from "@/src/store/useNotificationStore";

const SessionsCountSection = () => {
  const [sessions, setSessions] = useState<SessionSummary[] | null>(null);
  const accessToken = useAuthStore((state) => state.accessToken);
  const setError = useNotificationStore((state) => state.setError);

  useFocusEffect(
    useCallback(() => {
      const fetchSessions = async () => {
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
      };
      fetchSessions();
    }, []),
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

  return (
    <View className="flex-row flex-wrap justify-between my-4">
      <SessionsCountCard
        logo="glass-cocktail"
        description="Total Sessions"
        count={totalSessions.toString()}
      />
      <SessionsCountCard
        logo="calendar-blank-outline"
        description="This Month"
        count={thisMonthSessions.toString()}
      />
    </View>
  );
};

export default SessionsCountSection;
