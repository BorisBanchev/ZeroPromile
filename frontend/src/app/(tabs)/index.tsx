import React, { useState, useEffect } from "react";
import { BacDisplay } from "@/src/components/home/BacDisplay";
import { Header } from "@/src/components/home/Header";
import { SoberStatusCard } from "@/src/components/home/SoberStatusCard";
import { ScrollView, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActiveSessionSection } from "@/src/components/home/ActiveSessionSection";
import { StartSessionSection } from "@/src/components/home/StartSessionSection";
import { HistoryLink } from "@/src/components/home/HistoryLink";
import { Disclaimer } from "@/src/components/home/Disclaimer";
import { Notification } from "@/src/components/ui/Notification";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useNotificationStore } from "@/src/store/useNotificationStore";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import sessionsService from "@/src/services/sessions";
import {
  calculateCurrentBAC,
  calculateTimeUntilSober,
} from "@/src/utils/calculateBAC";
import { ActiveSession } from "@/src/types/sessions";

export default function HomeScreen() {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const setError = useNotificationStore((state) => state.setError);
  const setSuccess = useNotificationStore((state) => state.setSuccess);

  const [activeSession, setActiveSession] = useState<ActiveSession | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [bacLevel, setBacLevel] = useState(0);
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isEndingSession, setIsEndingSession] = useState(false);

  useEffect(() => {
    if (!activeSession?.drinks?.length) {
      setBacLevel(0);
      setTime({ hours: 0, minutes: 0, seconds: 0 });
      return;
    }
    const tick = async () => {
      const bac = calculateCurrentBAC(activeSession.drinks);
      setBacLevel(bac);
      setTime(calculateTimeUntilSober(bac));

      if (bac <= 0 && accessToken && !isEndingSession) {
        setIsEndingSession(true);
        try {
          await sessionsService.endSession(accessToken);
          setActiveSession(null);
          setBacLevel(0);
          setTime({ hours: 0, minutes: 0, seconds: 0 });
        } catch (error) {
          setError(
            error instanceof Error
              ? error.message
              : "Failed to end the session",
          );
        } finally {
          setIsEndingSession(false);
        }
      }
    };
    void tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [activeSession?.drinks, accessToken, isEndingSession, setError]);

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
    router.push("/modals/add-drink");
  };

  const handleEndSession = async () => {
    if (!accessToken || !activeSession || isEndingSession) return;

    setIsEndingSession(true);
    try {
      await sessionsService.endSession(accessToken);
      setActiveSession(null);
      setBacLevel(0);
      setTime({ hours: 0, minutes: 0, seconds: 0 });
      setSuccess("Session ended successfully");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to end session",
      );
    } finally {
      setIsEndingSession(false);
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

  const isSober = !activeSession || bacLevel === 0;

  return (
    <SafeAreaView className="flex-1 bg-[#0A1628]" edges={["top"]}>
      <Notification />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <Header />
        <BacDisplay bacLevel={bacLevel} />
        {!activeSession ? (
          <View className="mx-20">
            <SoberStatusCard />
            <StartSessionSection onStartSession={handleStartSession} />
          </View>
        ) : (
          <ActiveSessionSection
            isSober={isSober}
            hours={time.hours}
            minutes={time.minutes}
            seconds={time.seconds}
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
