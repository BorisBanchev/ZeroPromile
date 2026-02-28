import React, { useState } from "react";
import { TouchableOpacity, Text, View, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/src/store/useAuthStore";
import { CustomAlert } from "../ui/CustomAlert";

export default function LogoutButton() {
  const logout = useAuthStore((state) => state.logout);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleLogout = () => {
    setShowAlert(true);
  };

  const confirmLogout = async () => {
    setShowAlert(false);
    try {
      setLoading(true);
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const cancelLogout = () => {
    setShowAlert(false);
  };

  return (
    <>
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
      <CustomAlert
        visible={showAlert}
        title="Log Out"
        message="Are you sure you want to log out?"
        onCancel={cancelLogout}
        onConfirm={confirmLogout}
        cancelText="Cancel"
        confirmText="Log Out"
      />
    </>
  );
}
