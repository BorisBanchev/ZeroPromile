import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuthStore } from "../../store/useAuthStore";

export default function ProfileScreen() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async (): Promise<void> => {
    await logout();
    router.replace("/login");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0A1628]" edges={["top", "bottom"]}>
      <View className="flex-1 px-6 py-8">
        <Text className="text-white text-3xl font-bold mb-8">Profile</Text>

        <TouchableOpacity
          className="bg-red-500/20 border border-red-500 rounded-2xl py-4 flex-row items-center justify-center"
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color="#EF4444" />
          <Text className="text-red-500 text-lg font-semibold ml-2">
            Log out
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
