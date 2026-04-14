import { View } from "react-native";
import ActiveSessionCard from "./ActiveSessionCard";
import { useSessions } from "@/src/hooks/useSessions";

const SessionsSection = () => {
  const { sessions } = useSessions();

  const activeSession = sessions?.find((session) => session.active);

  return (
    <View>
      {activeSession && <ActiveSessionCard activeSession={activeSession} />}
    </View>
  );
};

export default SessionsSection;
