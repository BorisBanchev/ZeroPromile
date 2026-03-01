import { View, Text } from "react-native";

export const Header = () => {
  return (
    <View className="items-center pt-5 pb-8">
      <View className="flex-row items-center mb-2">
        <View className="w-10 h-10 rounded-lg bg-teal-400 justify-center items-center mr-2">
          <Text className="text-white text-lg font-bold">ZP</Text>
        </View>
        <Text className="text-white text-3xl font-bold">
          Zero<Text className="text-teal-400">Promile</Text>
        </Text>
      </View>
      <Text className="text-gray-400 text-sm">Know when you are safe</Text>
    </View>
  );
};
