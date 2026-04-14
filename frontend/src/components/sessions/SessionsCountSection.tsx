import { View } from "react-native";
import SessionsCountCard from "./SessionsCountCard";
import { useSessions } from "@/src/hooks/useSessions";

const SessionsCountSection = () => {
  const { totalSessions, thisMonthSessions } = useSessions();

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
