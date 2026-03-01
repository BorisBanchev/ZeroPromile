import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
export const SoberStatusCard = () => {
  return (
    <View className="p-6 rounded-2xl items-center mb-8 border bg-[#102d34] border-[#145c4e]">
      <View
        className="w-14 h-14 rounded-full justify-center items-center mb-3 border-2
             bg-[#133437] border-[#33d399]"
      >
        <Ionicons name="checkmark" size={32} color="#33d399" />
      </View>
      <Text
        className="text-xl font-semibold mb-1 
          text-[#33d399]"
      >
        You are Sober
      </Text>
    </View>
  );
};
