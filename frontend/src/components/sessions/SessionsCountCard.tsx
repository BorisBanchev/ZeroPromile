import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface SessionsCountCardProps {
  logo: keyof typeof MaterialCommunityIcons.glyphMap;
  description: string;
  count: string;
}

const SessionsCountCard = ({
  logo,
  description,
  count,
}: SessionsCountCardProps) => {
  return (
    <View className="w-[48%] h-20 mb-3 bg-slate-800/40 border border-slate-700 rounded-xl px-3 py-2">
      <View className="flex-row items-center gap-2">
        <MaterialCommunityIcons name={logo} color="grey" size={14} />
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          className="flex-1 text-gray-400 text-sm font-semibold"
        >
          {description}
        </Text>
      </View>
      <Text className="text-white text-2xl font-bold mt-1">{count}</Text>
    </View>
  );
};

export default SessionsCountCard;
