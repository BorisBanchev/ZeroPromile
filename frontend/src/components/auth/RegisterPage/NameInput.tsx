import { View, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface NameInputProps {
  fullName: string;
  setFullName: React.Dispatch<React.SetStateAction<string>>;
}

export const NameInput = ({ fullName, setFullName }: NameInputProps) => {
  return (
    <View className="bg-[#0F1E2E] border border-[#1E3A52] rounded-2xl px-4 py-4 flex-row items-center">
      <Ionicons name="person-outline" size={24} color="grey" className="mr-3" />
      <TextInput
        placeholder="Full name"
        placeholderTextColor="#64748B"
        value={fullName}
        onChangeText={setFullName}
        autoCapitalize="words"
        autoComplete="name"
        className="flex-1 text-white text-base"
      />
    </View>
  );
};
