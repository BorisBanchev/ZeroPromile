import React from "react";
import { View, Text } from "react-native";

interface DrinksCounterProps {
  count: number;
}

export const DrinksCounter: React.FC<DrinksCounterProps> = ({ count }) => {
  return (
    <View className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700 flex-row justify-between items-center">
      <Text className="text-gray-300 text-base">Drinks this session</Text>
      <Text className="text-white text-2xl font-bold">{count}</Text>
    </View>
  );
};
