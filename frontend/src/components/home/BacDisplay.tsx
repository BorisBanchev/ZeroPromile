import { Text, View } from "react-native";

interface BacDisplayProps {
  bacLevel: number;
}

export const BacDisplay = ({ bacLevel }: BacDisplayProps) => {
  const state =
    bacLevel === 0 ? "sober" : bacLevel <= 0.5 ? "caution" : "dangerous";

  const styles = {
    sober: {
      border: "border-green-600",
      bg: "bg-[#112e34]",
      text: "text-[#33d399]",
      label: "Sober",
    },
    caution: {
      border: "border-yellow-500",
      bg: "bg-yellow-500/15",
      text: "text-yellow-500",
      label: "Caution",
    },
    dangerous: {
      border: "border-red-500",
      bg: "bg-red-500/15",
      text: "text-red-500",
      label: "Dangerous",
    },
  }[state];

  const displayedBac = bacLevel > 0 && bacLevel < 0.01 ? 0.01 : bacLevel;

  return (
    <View className="items-center my-7">
      <View
        className={`w-60 h-60 rounded-full border-[9px] justify-center items-center ${styles.border}`}
      >
        <Text className="text-white text-6xl">{displayedBac.toFixed(2)}</Text>
        <Text className="text-gray-400 text-base mt-1">‰ BAC</Text>
        <View className={`mt-3 px-4 py-1.5 rounded-xl ${styles.bg}`}>
          <Text className={`text-sm font-semibold ${styles.text}`}>
            {styles.label}
          </Text>
        </View>
      </View>
    </View>
  );
};
