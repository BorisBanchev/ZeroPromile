import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface ProfileHeaderProps {
  name: string;
  email: string;
}

export const ProfileHeader = ({ name, email }: ProfileHeaderProps) => {
  return (
    <View className="flex-row items-center p-5">
      <View className="w-[60px] h-[60px] rounded-full bg-[#2DD4BF] justify-center items-center mr-4">
        <Ionicons name="person-outline" size={32} color="#FFFFFF" />
      </View>

      <View className="flex-1">
        <Text className="text-[20px] font-semibold text-white mb-1">
          {name}
        </Text>
        <Text className="text-[14px] text-[#9CA3AF]">{email}</Text>
      </View>
    </View>
  );
};
