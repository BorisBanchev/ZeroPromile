import { View, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ConfirmPasswordInputProps {
  confirmPassword: string;
  setConfirmPassword: React.Dispatch<React.SetStateAction<string>>;
}

export const ConfirmPasswordInput = ({
  confirmPassword,
  setConfirmPassword,
}: ConfirmPasswordInputProps) => {
  return (
    <View className="bg-[#0F1E2E] border border-[#1E3A52] rounded-2xl px-4 py-4 flex-row items-center">
      <Ionicons
        name="lock-closed-outline"
        size={24}
        color="grey"
        className="mr-3"
      />
      <TextInput
        placeholder="Confirm password"
        placeholderTextColor="#64748B"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={true}
        autoComplete="off"
        className="flex-1 text-white text-base"
      />
    </View>
  );
};
