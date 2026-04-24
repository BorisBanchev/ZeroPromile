import { View, Text } from "react-native";
import SessionCard from "./SessionCard";
import { useSessions } from "@/src/hooks/useSessions";
import { groupSessionsByMonth } from "@/src/utils/groupSessionsByMonth";

interface SessionsScreenProps {
  searchTerm: string;
}

const SessionsSection = ({ searchTerm }: SessionsScreenProps) => {
  const { sessions } = useSessions();

  if (!sessions) return null;

  const normalizedSearch = searchTerm.toLocaleLowerCase().trim();

  const filteredSessions = sessions.filter((session) => {
    if (!normalizedSearch) return true;

    return session.sessionName?.toLowerCase().includes(normalizedSearch);
  });

  const activeSession = filteredSessions.find((s) => s.active);
  const pastSessions = filteredSessions.filter((s) => !s.active);

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

          <SessionCard session={activeSession} />
        </View>
      )}

      {Object.entries(grouped).map(([month, monthSessions]) => (
        <View key={month} className="mb-6">
          <Text className="text-gray-400 font-semibold mb-2">{month}</Text>

          {monthSessions.map((session) => (
            <SessionCard key={session.sessionId} session={session} />
          ))}
        </View>
      ))}
    </View>
  );
};

export default SessionsSection;
