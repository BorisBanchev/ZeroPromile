import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SessionsHeader from "@/src/components/sessions/SessionsHeader";

export default function SessionsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#0A1628]" edges={["top"]}>
      <SessionsHeader
        title="Sessions"
        description="Track your drinking history"
      />
    </SafeAreaView>
  );
}
