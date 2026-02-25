import React from "react";
import { Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProfileHeader } from "@/src/components/profile/ProfileHeader";
import { ProfileInfoRow } from "@/src/components/profile/ProfileInfoRow";
import { EditProfileButton } from "@/src/components/profile/EditProfileButton";
import LogoutButton from "@/src/components/profile/LogoutButton";

const MOCK_USER = {
  name: "Boris Banchev",
  email: "boris@gmail.com",
  weightKg: 85,
  gender: "Male",
};

export default function ProfileScreen() {
  const handleEditProfile = () => {
    console.log("Edit profile pressed");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0A1628]">
      <ScrollView className="flex-1">
        <View className="p-4">
          <Text className="text-[28px] font-bold text-white mb-6 mt-4">
            Profile
          </Text>

          <View className="bg-[#354353b9] rounded-2xl overflow-hidden">
            <ProfileHeader name={MOCK_USER.name} email={MOCK_USER.email} />
            <ProfileInfoRow
              icon="scale-outline"
              label="Weight"
              value={`${MOCK_USER.weightKg} kg`}
            />
            <ProfileInfoRow
              icon={
                MOCK_USER.gender === "Male" ? "man-outline" : "woman-outline"
              }
              label="Gender"
              value={MOCK_USER.gender}
            />
            <View className="h-[1px] bg-[#2D3748] mx-4" />

            <EditProfileButton onPress={handleEditProfile} />
          </View>
          <LogoutButton />
          <Text className="text-[12px] text-gray-500 text-center mt-6 mb-8 px-4">
            Your data is used only for BAC calculations and is stored securely.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
