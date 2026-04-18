import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSessions } from "@/src/hooks/useSessions";
import { ScrollView, Text, TouchableOpacity } from "react-native";
import { Notification } from "@/src/components/ui/Notification";
import AntDesign from "@expo/vector-icons/AntDesign";
import SessionPageHeader from "@/src/components/session/SessionPageHeader";
import { useAuthStore } from "@/src/store/useAuthStore";
import { calculateSessionTotalAlcoholGrams } from "@/src/utils/calculateTotalAlcoholGrams";
import SessionStatsSection from "@/src/components/session/SessionStatsSection";

export default function SessionScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { sessions } = useSessions();
  const user = useAuthStore((state) => state.user);
  const session = sessions?.find((session) => session.sessionId === id);

  if (!session || !user) return;

  const sessionTotalAlcoholGrams =
    calculateSessionTotalAlcoholGrams(
      session.drinks,
      user.weightKg,
      user.gender === "male" ? 0.68 : 0.55,
    ).toFixed(0) + "g";

  return (
    <SafeAreaView className="flex-1 bg-[#0A1628]" edges={["top"]}>
      <Notification />
      <ScrollView className="px-4 py-">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center gap-1 mb-3 "
        >
          <AntDesign name="arrow-left" size={12} color="grey" />
          <Text className="text-gray-400">Back</Text>
        </TouchableOpacity>
        <SessionPageHeader session={session} />
        <SessionStatsSection
          session={session}
          sessionTotalAlcoholGrams={sessionTotalAlcoholGrams}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
