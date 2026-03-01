import { View } from "react-native";
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
    </View>
  );
};
