import { View, Text } from "react-native";

interface SessionsHeaderProps {
  title: string;
  description: string;
}

const SessionsHeader = ({ title, description }: SessionsHeaderProps) => {
  return (
    <View className="flex-1">
      <Text className="text-white text-2xl font-bold">{title}</Text>
      <Text className="text-gray-400 text-xs font-semibold">{description}</Text>
    </View>
  );
};

export default SessionsHeader;
