import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface StartSessionButtonProps {
  onPress: () => void;
  isLoading: boolean;
  disabled: boolean;
}

export const StartSessionButton: React.FC<StartSessionButtonProps> = ({
  onPress,
  isLoading,
  disabled,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      className="bg-[#2DD4BF] rounded-2xl py-4 items-center flex-row justify-center"
      style={{ opacity: disabled || isLoading ? 0.5 : 1 }}
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <>
          <Ionicons name="play" size={20} color="#fff" />
          <Text className="text-white text-base font-semibold ml-2">
            Start Session
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};
