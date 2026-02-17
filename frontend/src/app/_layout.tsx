import { useEffect } from "react";
import { Stack } from "expo-router";
import "./globals.css";
import { useAuthStore } from "../store/useAuthStore";
import { ActivityIndicator } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  const { user, isInitialized, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, []);

  if (!isInitialized) {
    return (
      <SafeAreaProvider>
        <SafeAreaView className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={!user}>
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
        </Stack.Protected>

        <Stack.Protected guard={!!user}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="modals/add-drink"
            options={{ presentation: "modal" }}
          />
          <Stack.Screen
            name="modals/custom-drink"
            options={{ presentation: "modal" }}
          />
          <Stack.Screen
            name="modals/start-session"
            options={{ presentation: "modal" }}
          />
          <Stack.Screen name="session/[id]" />
        </Stack.Protected>
      </Stack>
    </SafeAreaProvider>
  );
}
