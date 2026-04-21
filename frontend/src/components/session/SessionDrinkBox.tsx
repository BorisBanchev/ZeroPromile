import { DrinkSnapshot } from "@/src/types/drinks";
import { formatTime24h } from "@/src/utils/chart/formatTime24hours";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { calculateDrinkAlcoholGrams } from "@/src/utils/calculateTotalAlcoholGrams";
import { useAuthStore } from "@/src/store/useAuthStore";
interface SessionDrinkBoxProps {
  drink: DrinkSnapshot;
}

const SessionDrinkBox = ({ drink }: SessionDrinkBoxProps) => {
  const drinkTimeString = formatTime24h(new Date(drink.consumedAt).getTime());
  const user = useAuthStore((state) => state.user);
  if (!user) return;

  const drinkAlcoholGrams =
    calculateDrinkAlcoholGrams(
      drink,
      user?.weightKg,
      user?.gender === "male" ? 0.68 : 0.55,
    ).toFixed(0) + "g";

  return (
    <View className="flex-row items-center justify-between w-full h-20 mb-3 bg-slate-800/40 border border-slate-700 rounded-xl p-3">
      <View className="flex-row items-center gap-3">
        <View className="w-10 h-10 rounded-full bg-yellow-500/20 items-center justify-center">
          <Ionicons name={"wine-outline"} size={14} color="yellow" />
        </View>

        <View>
          <Text className="text-white font-semibold">{drink.drinkName}</Text>
          <Text className="text-gray-400 text-xs">
            {drink.volumeMl}ml • {drink.abv}% ABV
          </Text>
        </View>
      </View>
      <View>
        <Text className="text-gray-300 font-medium">{drinkTimeString}</Text>
        <Text className="text-gray-400 text-xs">+{drinkAlcoholGrams}</Text>
      </View>
    </View>
  );
};

export default SessionDrinkBox;
