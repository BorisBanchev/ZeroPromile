import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/src/store/useAuthStore";

export default function LogoutButton() {
  const logout = useAuthStore((state) => state.logout);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);
            await logout();
          } catch (error) {
            console.error("Logout failed:", error);
            Alert.alert("Error", "Failed to log out. Please try again.");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  return (
    <TouchableOpacity
      className="bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl py-4 px-4 mt-4"
      onPress={handleLogout}
      activeOpacity={0.7}
      disabled={loading}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          {loading ? (
            <ActivityIndicator size="small" color="#EF4444" />
          ) : (
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          )}
          <Text className="text-[16px] font-semibold text-[#EF4444] ml-3">
            {loading ? "Logging out..." : "Log Out"}
          </Text>
        </View>

        {!loading && (
          <Ionicons name="chevron-forward" size={20} color="#EF4444" />
        )}
      </View>
    </TouchableOpacity>
  );
}
