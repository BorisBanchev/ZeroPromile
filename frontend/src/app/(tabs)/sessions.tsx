import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Notification } from "@/src/components/ui/Notification";
import SessionsHeader from "@/src/components/sessions/SessionsHeader";
import { ScrollView } from "react-native";
import SessionsCountSection from "@/src/components/sessions/SessionsCountSection";
import SessionsSection from "@/src/components/sessions/SessionsSection";
import SessionsSearch from "@/src/components/sessions/SessionsSearch";

export default function SessionsScreen() {
  const [searchTerm, setSearchTerm] = useState<string>("");

  return (
    <SafeAreaView className="flex-1 bg-[#0A1628]" edges={["top"]}>
      <Notification />
      <ScrollView
        className="flex-1 mx-4"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <SessionsHeader
          title="Sessions"
          description="Track your drinking history"
        />
        <SessionsCountSection />
        <SessionsSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <SessionsSection searchTerm={searchTerm} />
      </ScrollView>
    </SafeAreaView>
  );
}
