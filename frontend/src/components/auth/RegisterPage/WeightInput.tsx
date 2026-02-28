import { View, TextInput } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface WeightInputProps {
  weight: string;
  setWeight: React.Dispatch<React.SetStateAction<string>>;
}

export const WeightInput = ({ weight, setWeight }: WeightInputProps) => {
  return (
    <View className="bg-[#0F1E2E] border border-[#1E3A52] rounded-2xl px-4 py-4 flex-row items-center">
      <MaterialCommunityIcons
        name="scale-balance"
        size={24}
        color="grey"
        className="mr-3"
      />
      <TextInput
        placeholder="Weight (kg)"
        placeholderTextColor="#64748B"
        value={weight}
        onChangeText={(text) => {
          // Replace comma with dot
          const filtered = text.replace(/,/g, ".").replace(/[^0-9.]/g, "");
          setWeight(filtered);
        }}
        keyboardType="decimal-pad"
        className="flex-1 text-white text-base"
      />
    </View>
  );
};
