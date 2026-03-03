import React from "react";
import { View, Text, TextInput } from "react-native";

interface StartSessionFormProps {
  sessionName: string;
  onChangeSessionName: (text: string) => void;
  isLoading: boolean;
  onSubmit: () => void;
}

export const StartSessionForm: React.FC<StartSessionFormProps> = ({
  sessionName,
  onChangeSessionName,
  isLoading,
  onSubmit,
}) => {
  return (
    <View>
      <Text className="text-gray-400 text-sm font-medium mb-3">
        Session Name
      </Text>
      <TextInput
        value={sessionName}
        onChangeText={onChangeSessionName}
        placeholder="e.g., Friday Night Out, Birthday Party..."
        placeholderTextColor="#6B7280"
        className="bg-[#0F1419] text-white text-base px-4 py-4 rounded-2xl mb-6 border border-gray-700/30"
        autoFocus
        editable={!isLoading}
        onSubmitEditing={onSubmit}
        returnKeyType="done"
      />
    </View>
  );
};
