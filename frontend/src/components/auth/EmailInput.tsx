import { View, TextInput } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface EmailInputProps {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
}

export const EmailInput = ({ email, setEmail }: EmailInputProps) => {
  return (
    <View className="bg-[#0F1E2E] border border-[#1E3A52] rounded-2xl px-4 py-4 flex-row items-center">
      <MaterialCommunityIcons
        name="email-outline"
        size={24}
        color="grey"
        className="pr-3"
      />
      <TextInput
        placeholder="Email address"
        placeholderTextColor="#64748B"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        className="flex-1 text-white text-base"
      />
    </View>
  );
};
