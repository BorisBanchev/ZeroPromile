import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface ProfileInfoRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}

export const ProfileInfoRow = ({ icon, label, value }: ProfileInfoRowProps) => {
  return (
    <>
      <View className="flex-row justify-between items-center py-4 px-5">
        <View className="flex-row items-center">
          <Ionicons name={icon} size={20} color="#9CA3AF" />
          <Text className="text-[16px] text-[#D1D5DB] ml-3">{label}</Text>
        </View>
        <Text className="text-[16px] font-semibold text-white">{value}</Text>
      </View>
      <View className="h-[1px] bg-[#354561] mx-4" />
    </>
  );
};
