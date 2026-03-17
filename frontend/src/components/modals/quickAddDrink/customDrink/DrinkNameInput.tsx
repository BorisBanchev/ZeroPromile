import React from "react";
import { View, Text, TextInput } from "react-native";

interface DrinkNameInputProps {
  value: string;
  onChangeValue: (value: string) => void;
  disabled?: boolean;
}

export const DrinkNameInput = ({
  value,
  onChangeValue,
  disabled = false,
}: DrinkNameInputProps) => {
  return (
    <View className="mb-4">
      <Text className="text-gray-400 text-sm font-medium mb-2">Drink Name</Text>
      <TextInput
        value={value}
        onChangeText={onChangeValue}
        placeholder="e.g., Heineken"
        placeholderTextColor="#6B7280"
        editable={!disabled}
        className="bg-[#1F2937] text-white rounded-xl px-4 py-3 text-base border border-gray-700/40"
      />
    </View>
  );
};
