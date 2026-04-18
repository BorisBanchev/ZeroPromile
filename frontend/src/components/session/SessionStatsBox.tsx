import { ReactNode } from "react";
import { View, Text } from "react-native";

interface SessionStatsBoxProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  valueColor?: string;
}

const SessionStatsBox = ({
  label,
  value,
  icon,
  valueColor = "white",
}: SessionStatsBoxProps) => {
  return (
    <View className="w-[48%] h-20 mb-3 bg-slate-800/40 border border-slate-700 rounded-xl px-3 py-2">
      <View className="flex-row items-center gap-2 my-1">
        {icon}
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          className="flex-1 text-gray-400 text-sm font-semibold"
        >
          {label}
        </Text>
      </View>
      <Text style={{ color: valueColor }} className="text-xl font-bold">
        {value}
      </Text>
    </View>
  );
};

export default SessionStatsBox;
