import { View, Text, TouchableOpacity } from "react-native";

interface GenderInputProps {
  gender: "male" | "female" | null;
  setGender: React.Dispatch<React.SetStateAction<"male" | "female" | null>>;
}

export const GenderInput = ({ gender, setGender }: GenderInputProps) => {
  return (
    <View className="flex-row gap-4">
      <TouchableOpacity
        className={`flex-1 rounded-2xl py-4 items-center justify-center ${
          gender === "male"
            ? "bg-[#2DD4BF] border-2 border-[#2DD4BF]"
            : "bg-[#0F1E2E] border-2 border-[#1E3A52]"
        }`}
        onPress={() => setGender("male")}
      >
        <Text className="text-4xl mb-2">🧑</Text>
        <Text
          className={`text-base font-semibold ${
            gender === "male" ? "text-white" : "text-[#94A3B8]"
          }`}
        >
          Male
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className={`flex-1 rounded-2xl py-4 items-center justify-center ${
          gender === "female"
            ? "bg-red-500 border-2 border-red-500"
            : "bg-[#0F1E2E] border-2 border-[#1E3A52]"
        }`}
        onPress={() => setGender("female")}
      >
        <Text className="text-4xl mb-2">👩</Text>
        <Text
          className={`text-base font-semibold ${
            gender === "female" ? "text-white" : "text-[#94A3B8]"
          }`}
        >
          Female
        </Text>
      </TouchableOpacity>
    </View>
  );
};
