import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface StartSessionHeaderProps {
  onClose: () => void;
  isLoading: boolean;
}

export const StartSessionHeader: React.FC<StartSessionHeaderProps> = ({
  onClose,
  isLoading,
}) => {
  return (
    <View className="px-6 pt-6 pb-4 border-b border-gray-700/50">
      <View className="flex-row items-center justify-between">
        <Text className="text-white text-xl font-bold flex-1">
          Start New Session
        </Text>
        <TouchableOpacity
          onPress={onClose}
          disabled={isLoading}
          className="w-8 h-8 items-center justify-center"
        >
          <Ionicons name="close" size={24} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
