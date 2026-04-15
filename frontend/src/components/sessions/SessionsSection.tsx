import { View, Text } from "react-native";
import SessionCard from "./SessionCard";
import { useSessions } from "@/src/hooks/useSessions";
import { groupSessionsByMonth } from "@/src/utils/groupSessionsByMonth";

const SessionsSection = () => {
  const { sessions } = useSessions();

  if (!sessions) return null;

  const activeSession = sessions.find((s) => s.active);
  const pastSessions = sessions.filter((s) => !s.active);

  const sorted = [...pastSessions].sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
  );

  const grouped = groupSessionsByMonth(sorted);

  return (
    <View>
      {activeSession && (
        <View className="mb-6">
          <Text className="text-[#32e1ca] font-semibold mb-2">
            Active Session
          </Text>

          <SessionCard session={activeSession} active={true} />
        </View>
      )}

      {Object.entries(grouped).map(([month, monthSessions]) => (
        <View key={month} className="mb-6">
          <Text className="text-gray-400 font-semibold mb-2">{month}</Text>

          {monthSessions.map((session) => (
            <SessionCard
              key={session.sessionId}
              session={session}
              active={session.active}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

export default SessionsSection;
