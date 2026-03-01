import { Text, View } from "react-native";

interface BacDisplayProps {
  bacLevel: number;
}

export const BacDisplay = ({ bacLevel }: BacDisplayProps) => {
  const isDangerous = bacLevel > 0.0;
  return (
    <View className="items-center my-7">
      <View
        className={`w-60 h-60 rounded-full border-[9px] justify-center items-center ${
          isDangerous ? "border-red-500" : "border-[#2b313f]"
        }`}
      >
        <Text className="text-white text-6xl">{bacLevel.toFixed(2)}</Text>
        <Text className="text-gray-400 text-base mt-1">‰ BAC</Text>
        <View
          className={`mt-3 px-4 py-1.5 rounded-xl ${
            isDangerous ? "bg-red-500/15" : "bg-[#112e34]"
          }`}
        >
          <Text
            className={`text-sm font-semibold ${
              isDangerous ? "text-red-500" : "text-[#33d399]"
            }`}
          >
            {isDangerous ? "Dangerous" : "Sober"}
          </Text>
        </View>
      </View>
    </View>
  );
};
