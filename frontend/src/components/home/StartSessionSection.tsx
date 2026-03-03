import { View, Text } from "react-native";
import { ActionButton } from "./ActionButton";

interface StartSessionSectionProps {
  onStartSession: () => void;
}

export const StartSessionSection = ({
  onStartSession,
}: StartSessionSectionProps) => {
  return (
    <View>
      <ActionButton
        onPress={onStartSession}
        title="Start Session"
        variant="primary"
      />
      <Text className="text-center text-gray-400 text-sm mt-2 mb-5">
        Begin tracking your drinks for the night
      </Text>
    </View>
  );
};
