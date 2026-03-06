import React from "react";
import { TouchableOpacity, Text } from "react-native";

interface CustomDrinkButtonProps {
  onPress: () => void;
}

export const CustomDrinkButton = ({ onPress }: CustomDrinkButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="border border-dashed border-gray-600 rounded-2xl py-4 items-center mt-4"
      activeOpacity={0.7}
    >
      <Text className="text-gray-400 text-base font-medium">
        + Custom Drink
      </Text>
    </TouchableOpacity>
  );
};
