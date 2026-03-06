import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";

interface AddDrinkButtonProps {
  onPress: () => void;
  isLoading: boolean;
  disabled: boolean;
}

export const AddDrinkButton = ({
  onPress,
  isLoading,
  disabled,
}: AddDrinkButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      className="bg-[#2DD4BF] rounded-2xl py-4 items-center mt-5"
      style={{ opacity: disabled || isLoading ? 0.5 : 1 }}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text className="text-white text-base font-semibold">Add Drink</Text>
      )}
    </TouchableOpacity>
  );
};
