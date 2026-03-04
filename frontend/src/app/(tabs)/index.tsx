import React, { useState } from "react";
import { BacDisplay } from "@/src/components/home/BacDisplay";
import { Header } from "@/src/components/home/Header";
import { SoberStatusCard } from "@/src/components/home/SoberStatusCard";
import { ScrollView, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActiveSessionSection } from "@/src/components/home/ActiveSessionSection";
import { StartSessionSection } from "@/src/components/home/StartSessionSection";
import { HistoryLink } from "@/src/components/home/HistoryLink";
import { Disclaimer } from "@/src/components/home/Disclaimer";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useNotificationStore } from "@/src/store/useNotificationStore";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import sessionsService, { ActiveSession } from "@/src/services/sessions";

export default function HomeScreen() {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const setError = useNotificationStore((state) => state.setError);
  const setSuccess = useNotificationStore((state) => state.setSuccess);

  const [activeSession, setActiveSession] = useState<ActiveSession | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const fetchActiveSession = async () => {
        if (!accessToken) {
          setIsLoading(false);
          return;
        }

        try {
          const session = await sessionsService.getActiveSession(accessToken);
          setActiveSession(session);
        } catch (error) {
          setError(
            error instanceof Error ? error.message : "Failed to load session",
          );
        } finally {
          setIsLoading(false);
        }
      };

      void fetchActiveSession();
    }, [accessToken, setError]),
  );

  const handleStartSession = () => {
    router.push("/modals/start-session");
  };

  const handleAddDrink = () => {
    console.log("Add drink pressed");
  };

  const handleEndSession = async () => {
    if (!accessToken) return;

    try {
      await sessionsService.endSession(accessToken);
      setActiveSession(null);
      setSuccess("Session ended successfully");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to end session",
      );
    }
  };

  const handleViewHistory = () => {
    console.log("View history pressed");
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-[#0A1628] justify-center items-center">
        <ActivityIndicator size="large" color="#2DD4BF" />
      </SafeAreaView>
    );
  }

  const isSober = !activeSession || activeSession.currentBAC === 0;
  const sessionIsActive = activeSession !== null;

  return (
    <SafeAreaView className="flex-1 bg-[#0A1628]" edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <Header />
        <BacDisplay bacLevel={activeSession?.currentBAC || 0.0} />
        {!sessionIsActive ? (
          <View className="mx-20">
            <SoberStatusCard />
            <StartSessionSection onStartSession={handleStartSession} />
          </View>
        ) : (
          <ActiveSessionSection
            isSober={isSober}
            hours={activeSession.timeUntilSobriety.hours}
            minutes={activeSession.timeUntilSobriety.minutes}
            seconds={0}
            soberTime={"--:--"}
            drinkCount={activeSession.totalDrinks}
            onAddDrink={handleAddDrink}
            onEndSession={handleEndSession}
          />
        )}
        <HistoryLink onPress={handleViewHistory} />
        <Disclaimer disclaimerText="Estimatates only. Never use for medical, legal, or driving decisions." />
      </ScrollView>
    </SafeAreaView>
  );
}
