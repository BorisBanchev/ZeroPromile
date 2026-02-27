import React, { useState } from "react";
import { Text, View, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProfileHeader } from "@/src/components/profile/ProfileHeader";
import { ProfileInfoRow } from "@/src/components/profile/ProfileInfoRow";
import { EditProfileButton } from "@/src/components/profile/EditProfileButton";
import { EditProfileView } from "@/src/components/profile/EditProfileView";
import LogoutButton from "@/src/components/profile/LogoutButton";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useNotificationStore } from "@/src/store/useNotificationStore";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const notification = useNotificationStore((state) => state.notification);
  const [showEditProfileView, setShowEditProfileView] = useState(false);

  const handleEditProfile = () => {
    setShowEditProfileView(true);
  };

  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-[#0A1628] justify-center items-center">
        <ActivityIndicator size="large" color="#2DD4BF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#0A1628]">
      <ScrollView className="flex-1">
        <View className="p-4">
          <Text className="text-[28px] font-bold text-white mb-6 mt-4">
            Profile
          </Text>
          {notification && notification.type === "success" && (
            <View className="mb-4 bg-green-500 border border-green-500 rounded-2xl px-4 py-3 flex-row items-center">
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color="green"
              />
              <Text className="text-white ml-2 flex-1">
                {notification.message}
              </Text>
            </View>
          )}
          {showEditProfileView ? (
            <EditProfileView
              user={user}
              onClose={() => setShowEditProfileView(false)}
            />
          ) : (
            <>
              <View className="bg-[#354353b9] rounded-2xl overflow-hidden">
                <ProfileHeader name={user.name} email={user.email} />
                <ProfileInfoRow
                  icon="scale-outline"
                  label="Weight"
                  value={`${user.weightKg} kg`}
                />
                <ProfileInfoRow
                  icon={
                    user.gender === "MALE" ? "man-outline" : "woman-outline"
                  }
                  label="Gender"
                  value={user.gender === "MALE" ? "Male" : "Female"}
                />
                <View className="h-[1px] bg-[#2D3748] mx-4" />

                <EditProfileButton onPress={handleEditProfile} />
              </View>
            </>
          )}
          <LogoutButton />
          <Text className="text-[12px] text-gray-500 text-center mt-6 mb-8 px-4">
            Your data is used only for BAC calculations and is stored securely.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
