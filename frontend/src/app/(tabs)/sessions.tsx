import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SessionsHeader from "@/src/components/sessions/SessionsHeader";
import { ScrollView } from "react-native";
import SessionsCountSection from "@/src/components/sessions/SessionsCountSection";

export default function SessionsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#0A1628]" edges={["top"]}>
      <ScrollView
        className="flex-1 mx-4"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <SessionsHeader
          title="Sessions"
          description="Track your drinking history"
        />
        <SessionsCountSection />
      </ScrollView>
    </SafeAreaView>
  );
}
