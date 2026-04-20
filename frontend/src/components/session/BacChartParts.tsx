import React from "react";
import { View, Text } from "react-native";

export const BacDataPoint = ({ item }: { item: any }) => {
  const isActive = item.isFocused;

  const size = isActive ? 10 : 6;
  const color = item.dataPointColor || "#49e2e2";

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        marginTop: -size / 4,
        marginLeft: -size / 4,
      }}
    />
  );
};

export const BacPointerLabel = ({
  item,
  chartMax,
}: {
  item: any;
  chartMax: number;
}) => {
  if (!item || !item.isDrink) return null;

  const TOOLTIP_WIDTH = 130;
  const TOOLTIP_HEIGHT = 82;
  const isNearBottom = item.value <= chartMax * 0.22;

  return (
    <View
      className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 shadow-2xl"
      style={{
        width: TOOLTIP_WIDTH,
        minHeight: TOOLTIP_HEIGHT,
        justifyContent: "center",
        transform: [{ translateY: isNearBottom ? -18 : 12 }],
      }}
    >
      <View className="flex-row justify-between items-center mb-1">
        <Text
          className="text-white font-bold text-[10px] flex-1 mr-1 pl-2"
          numberOfLines={1}
        >
          {item.drinkName}
        </Text>
        <Text className="text-gray-400 text-[9px]">{item.label}</Text>
      </View>

      <Text className="text-[#49e2e2] font-black text-lg">
        {Number(item.value).toFixed(2)}‰
      </Text>

      <View className="flex-row gap-2 border-t border-slate-800 mt-1 pt-1">
        <Text className="text-gray-400 text-[9px]">
          {item.volume ? `${item.volume}ml` : "-"}
        </Text>
        <Text className="text-gray-400 text-[9px]">
          {item.abv ? `${item.abv}%` : "-"}
        </Text>
      </View>
    </View>
  );
};
