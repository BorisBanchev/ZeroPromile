import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export interface QuickDrink {
  name: string;
  volumeMl: number;
  abv: number;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
  borderColor: string;
}

export const QUICK_DRINKS: QuickDrink[] = [
  {
    name: "Beer",
    volumeMl: 500,
    abv: 5,
    icon: "beer",
    color: "#433129",
    borderColor: "#ffffff",
  },
  {
    name: "Wine",
    volumeMl: 120,
    abv: 12,
    icon: "glass-wine",
    color: "#441f34",
    borderColor: "#ffffff",
  },
  {
    name: "Shot",
    volumeMl: 40,
    abv: 40,
    icon: "cup",
    color: "#13364a",
    borderColor: "#ffffff",
  },
  {
    name: "Cocktail",
    volumeMl: 200,
    abv: 15,
    icon: "glass-cocktail",
    color: "#2f2053",
    borderColor: "#ffffff",
  },
];

interface QuickSelectGridProps {
  selectedDrink: QuickDrink | null;
  onSelect: (drink: QuickDrink) => void;
}

export const QuickSelectGrid = ({
  selectedDrink,
  onSelect,
}: QuickSelectGridProps) => {
  return (
    <View>
      <Text className="text-gray-400 text-sm font-medium mb-3">
        Quick Select
      </Text>
      <View className="flex-row gap-3">
        {QUICK_DRINKS.map((drink) => {
          const isSelected = selectedDrink?.name === drink.name;
          return (
            <TouchableOpacity
              key={drink.name}
              onPress={() => onSelect(drink)}
              className="flex-1 rounded-2xl py-4 items-center justify-center"
              style={{
                backgroundColor: isSelected ? drink.color : "#1A1F2E",
                borderWidth: 1.5,
                borderColor: isSelected ? drink.borderColor : "#2D3748",
              }}
            >
              <MaterialCommunityIcons
                name={drink.icon}
                size={28}
                color={isSelected ? "#FFFFFF" : "#9CA3AF"}
              />
              <Text
                className={`text-sm font-semibold mt-2 ${isSelected ? "text-white" : "text-gray-400"}`}
              >
                {drink.name}
              </Text>
              <Text className="text-gray-500 text-xs mt-0.5">
                {drink.volumeMl}ml · {drink.abv}%
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
