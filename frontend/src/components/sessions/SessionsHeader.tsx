import { View, Text } from "react-native";

interface SessionsHeaderProps {
  title: string;
  description: string;
}

const SessionsHeader = ({ title, description }: SessionsHeaderProps) => {
  return (
    <View>
      <Text className="text-white text-xl">{title}</Text>
      <Text className="text-gray-400 text-sm">{description}</Text>
    </View>
  );
};

export default SessionsHeader;
