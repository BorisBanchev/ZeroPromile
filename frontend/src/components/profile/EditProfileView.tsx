import { useState } from "react";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useNotificationStore } from "@/src/store/useNotificationStore";
import { User } from "@/src/types/auth";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { ProfileHeader } from "./ProfileHeader";
import updateUserProfileService from "../../services/updateProfile";

interface EditProfileViewProps {
  user: User;
  onClose: () => void;
}

export const EditProfileView = ({ user, onClose }: EditProfileViewProps) => {
  const [weightKg, setWeightKg] = useState(user.weightKg.toString());
  const [gender, setGender] = useState<"MALE" | "FEMALE">(user.gender);
  const [isUpdating, setIsUpdating] = useState(false);

  const accessToken = useAuthStore((state) => state.accessToken);
  const setSuccess = useNotificationStore((state) => state.setSuccess);
  const setError = useNotificationStore((state) => state.setError);

  const handleCancel = () => {
    onClose();
  };

  const handleSave = async () => {
    const weight = parseFloat(weightKg);

    if (!accessToken) {
      setError("Not authenticated");
      return;
    }

    setIsUpdating(true);
    try {
      const response = await updateUserProfileService.updateUserProfile(
        accessToken,
        {
          gender: gender.toLocaleLowerCase() as "male" | "female",
          weight: weight,
        },
      );
      useAuthStore.setState({
        user: {
          ...user,
          gender: response.data.gender as "MALE" | "FEMALE",
          weightKg: response.data.weightKg,
        },
      });
      setSuccess("Profile updated successfully");
      onClose();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update profile";
      setError(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <View className="bg-[#354353b9] rounded-2xl overflow-hidden">
      <ProfileHeader name={user.name} email={user.email} />
      <View className="px-4 py-4">
        <Text className="text-white text-sm font-medium mb-2">
          Weight (kg) <Text className="text-red-500">*</Text>
        </Text>
        <TextInput
          value={weightKg}
          onChangeText={setWeightKg}
          keyboardType="numeric"
          className="bg-[#1F2937] text-white rounded-lg px-4 py-3 text-base"
        />
        <Text className="text-gray-500 text-xs mt-1">
          Required for BAC calculation
        </Text>
      </View>

      <View className="px-4 pb-4">
        <Text className="text-white text-sm font-medium mb-2">
          Gender <Text className="text-red-500">*</Text>
        </Text>
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={() => setGender("MALE")}
            className={`flex-1 py-4 rounded-lg items-center ${
              gender === "MALE" ? "bg-[#2DD4BF]" : "bg-[#2D3748]"
            }`}
          >
            <Text className="text-2xl mb-1">🧔</Text>
            <Text className="text-white font-medium">Male</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setGender("FEMALE")}
            className={`flex-1 py-4 rounded-lg items-center ${
              gender === "FEMALE" ? "bg-red-500" : "bg-[#2D3748]"
            }`}
          >
            <Text className="text-2xl mb-1">👩</Text>
            <Text className="text-white font-medium">Female</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-gray-500 text-xs mt-1">
          Required for BAC calculation
        </Text>
      </View>

      <View className="flex-row gap-3 px-4 pb-4">
        <TouchableOpacity
          onPress={handleCancel}
          disabled={isUpdating}
          className="flex-1 bg-[#2D3748] py-4 rounded-lg items-center border border-gray-500"
        >
          <Text className="text-white font-semibold text-base">Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSave}
          disabled={isUpdating}
          className="flex-1 bg-[#2DD4BF] py-4 rounded-lg items-center flex-row justify-center"
        >
          {isUpdating ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Text className="text-white font-semibold text-base mr-2">✓</Text>
              <Text className="text-white font-semibold text-base">Save</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};
