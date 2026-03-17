import React from "react";
import { TouchableOpacity, Text } from "react-native";

interface BackToQuickSelectButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

export const BackToQuickSelectButton = ({
  onPress,
  disabled = false,
}: BackToQuickSelectButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className="mt-1 mb-2"
      activeOpacity={0.8}
    >
      <Text className="text-gray-400 text-sm">← Back to quick select</Text>
    </TouchableOpacity>
  );
};
