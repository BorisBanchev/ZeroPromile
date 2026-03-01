import React, { useState } from "react";
import { BacDisplay } from "@/src/components/home/BacDisplay";
import { Header } from "@/src/components/home/Header";
import { SoberStatusCard } from "@/src/components/home/SoberStatusCard";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActiveSessionSection } from "@/src/components/home/ActiveSessionSection";
import { StartSessionSection } from "@/src/components/home/StartSessionSection";

export default function HomeScreen() {
  const [bacLevel, setBacLevel] = useState(0.0);
  const [drinkCount] = useState(2);

  const [timeToSobriety] = useState({
    hours: 12,
    minutes: 4,
    seconds: 23,
    soberTime: "21:32",
  });
  const isSober = bacLevel === 0.0;
  const handleStartSession = () => {
    console.log("Start session pressed");
    setBacLevel(0.59);
  };

  const handleAddDrink = () => {
    console.log("Add drink pressed");
  };

  const handleEndSession = () => {
    console.log("End session pressed");
    setBacLevel(0.0);
  };

  const handleViewHistory = () => {
    console.log("View history pressed");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0A1628]" edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <Header />
        <BacDisplay bacLevel={bacLevel} />
        {isSober ? (
          <View className="mx-20">
            <SoberStatusCard />
            <StartSessionSection onStartSession={handleStartSession} />
          </View>
        ) : (
          <ActiveSessionSection
            isSober={isSober}
            hours={timeToSobriety.hours}
            minutes={timeToSobriety.minutes}
            seconds={timeToSobriety.seconds}
            soberTime={timeToSobriety.soberTime}
            drinkCount={drinkCount}
            onAddDrink={handleAddDrink}
            onEndSession={handleEndSession}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
