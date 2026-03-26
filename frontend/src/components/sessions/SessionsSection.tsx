import { View, Text } from "react-native";
import { useFetchActiveSession } from "@/src/hooks/useFetchActiveSession";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import ActiveSessionCard from "./ActiveSessionCard";

const SessionsSection = () => {
  const { activeSession, loadingActiveSession, fetchActiveSession } =
    useFetchActiveSession();

  useFocusEffect(
    useCallback(() => {
      fetchActiveSession();
    }, [fetchActiveSession]),
  );

  return (
    <View>
      {activeSession && <ActiveSessionCard activeSession={activeSession} />}
      <Text>Past Sessions:</Text>
    </View>
  );
};

export default SessionsSection;
