import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface PasswordInputProps {
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PasswordInput = ({
  password,
  setPassword,
  showPassword,
  setShowPassword,
}: PasswordInputProps) => {
  return (
    <View className="bg-[#0F1E2E] border border-[#1E3A52] rounded-2xl px-4 py-4 flex-row items-center">
      <Ionicons
        name="lock-closed-outline"
        size={24}
        color="grey"
        className="mr-3"
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="#64748B"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        autoComplete="password"
        className="flex-1 text-white text-base"
      />
      <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
        {showPassword ? (
          <Ionicons name="eye-outline" size={24} color="grey" />
        ) : (
          <Ionicons name="eye-off-outline" size={24} color="grey" />
        )}
      </TouchableOpacity>
    </View>
  );
};
