import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

interface DrinkStepperProps {
  label: string;
  value: string;
  unit?: string;
  onChangeValue: (value: string) => void;
  onIncrement: () => void;
  onDecrement: () => void;
  disabled?: boolean;
}

export const DrinkStepper = ({
  label,
  value,
  unit,
  onChangeValue,
  onIncrement,
  onDecrement,
  disabled = false,
}: DrinkStepperProps) => {
  return (
    <View className="mb-4">
      <Text className="text-gray-400 text-sm font-medium mb-2">{label}</Text>

      <View className="flex-row items-center">
        <TouchableOpacity
          onPress={onDecrement}
          disabled={disabled}
          className="w-10 h-10 rounded-xl bg-[#2D3748] items-center justify-center border border-gray-600/40"
          activeOpacity={0.8}
        >
          <Text className="text-white text-xl">-</Text>
        </TouchableOpacity>

        <View className="flex-1 mx-4 items-center justify-center">
          <View className="flex-row items-baseline">
            <TextInput
              value={value}
              onChangeText={onChangeValue}
              keyboardType="numeric"
              editable={!disabled}
              textAlign="center"
              className="text-white text-3xl font-semibold min-w-[80px]"
            />
            {unit ? (
              <Text className="text-white text-2xl font-semibold ml-1">
                {unit}
              </Text>
            ) : null}
          </View>
        </View>

        <TouchableOpacity
          onPress={onIncrement}
          disabled={disabled}
          className="w-10 h-10 rounded-xl bg-[#2D3748] items-center justify-center border border-gray-600/40"
          activeOpacity={0.8}
        >
          <Text className="text-white text-xl">+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
