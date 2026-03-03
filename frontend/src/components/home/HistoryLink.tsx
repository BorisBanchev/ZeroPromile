import { TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface HistoryLinkProps {
  onPress: () => void;
}

export const HistoryLink = ({ onPress }: HistoryLinkProps) => {
  return (
    <TouchableOpacity
      className="flex-row items-center justify-center mb-5 mt-3"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons name="timer-outline" size={20} color="#8B92A5" />
      <Text className="text-gray-400 text-base ml-2">View Session History</Text>
    </TouchableOpacity>
  );
};
