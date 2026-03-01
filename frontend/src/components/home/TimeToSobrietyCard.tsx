import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface TimeToSobrietyCardProps {
  hours: number;
  minutes: number;
  seconds: number;
  soberTime: string;
}

export const TimeToSobrietyCard = ({
  hours,
  minutes,
  seconds,
  soberTime,
}: TimeToSobrietyCardProps) => {
  return (
    <View className="rounded-2xl bg-slate-800/50 border border-slate-700">
      <View className="flex-row items-center justify-center mb-4 mt-3">
        <Ionicons name="time-outline" size={20} color="#8B92A5" />
        <Text className="text-gray-400 text-sm ml-2  uppercase tracking-wide">
          Time to Sobriety
        </Text>
      </View>

      <View className="flex-row justify-center items-end mb-3">
        <View className="items-center mx-3">
          <Text className="text-white text-5xl ">{hours}</Text>
          <Text className="text-gray-400 text-xs uppercase mt-1">HRS</Text>
        </View>

        <Text className="text-[#666974] text-4xl mb-2">:</Text>

        <View className="items-center mx-3">
          <Text className="text-white text-5xl">
            {minutes.toString().padStart(2, "0")}
          </Text>
          <Text className="text-gray-400 text-xs uppercase mt-1">MIN</Text>
        </View>

        <Text className="text-[#666974] text-4xl mb-2">:</Text>

        <View className="items-center mx-3">
          <Text className="text-gray-400 text-5xl">
            {seconds.toString().padStart(2, "0")}
          </Text>
          <Text className="text-gray-400 text-xs uppercase mt-1">SEC</Text>
        </View>
      </View>

      <Text className="text-center text-gray-400 text-sm mb-3">
        Sober at {soberTime}
      </Text>
    </View>
  );
};
