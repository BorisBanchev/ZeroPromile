import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface DisclaimerProps {
  disclaimerText: string;
}

export const Disclaimer = ({ disclaimerText }: DisclaimerProps) => {
  return (
    <View className="flex-row items-center mx-5 mb-5 px-3">
      <Ionicons name="warning" size={16} color="#D4A853" />
      <Text
        numberOfLines={1}
        className="text-gray-400 text-xs flex-1 text-center"
      >
        {disclaimerText}
      </Text>
    </View>
  );
};
