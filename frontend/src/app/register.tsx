import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Text,
  StatusBar,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { RegisterCredentials } from "../types/auth";
import { useAuthStore } from "../store/useAuthStore";
import { Notification } from "../components/ui/Notification";

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading } = useAuthStore();
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [gender, setGender] = useState<"male" | "female" | null>(null);
  const [weight, setWeight] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleRegister = async (): Promise<void> => {
    const credentials: RegisterCredentials = {
      name: fullName,
      email,
      password,
      passwordConfirm: confirmPassword,
      gender,
      weightKg: parseFloat(weight),
    };
    await register(credentials);
  };

  const navigateToLogin = (): void => {
    router.push("/login");
  };

  const isFormValid =
    !!fullName && !!email && !!password && !!gender && !!weight;

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0A1628" />
      <SafeAreaView className="flex-1 bg-[#0A1628]" edges={["bottom", "top"]}>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 25 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center my-8">
            <View className="w-24 h-24 bg-[#2DD4BF] rounded-3xl items-center justify-center mb-1">
              <Text className="text-white text-4xl font-bold">ZP</Text>
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-white text-3xl font-bold text-center mb-2">
              Create Account
            </Text>
            <Text className="text-[#94A3B8] text-base text-center">
              Join ZeroPromile today
            </Text>
          </View>

          <Notification />

          <View className="mb-4">
            <View className="bg-[#0F1E2E] border border-[#1E3A52] rounded-2xl px-4 py-4 flex-row items-center">
              <Ionicons
                name="person-outline"
                size={24}
                color="grey"
                className="mr-3"
              />
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
          </View>

          <View className="mb-4">
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
          </View>

          <View className="mb-4">
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
          </View>

          <View className="mb-4">
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
                autoComplete="password"
                className="flex-1 text-white text-base"
              />
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-[#94A3B8] text-sm mb-3">
              Gender (for BAC calculation)
            </Text>
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
          </View>

          <View className="mb-6">
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
                  const filtered = text
                    .replace(/,/g, ".")
                    .replace(/[^0-9.]/g, "");
                  setWeight(filtered);
                }}
                keyboardType="decimal-pad"
                className="flex-1 text-white text-base"
              />
            </View>
            <Text className="text-[#64748B] text-xs mt-2 ml-1">
              Required for accurate BAC calculation
            </Text>
          </View>

          <TouchableOpacity
            className="rounded-2xl py-4 items-center mb-6 bg-[#2DD4BF]"
            onPress={handleRegister}
            disabled={isLoading || !isFormValid}
            style={{ opacity: isLoading || !isFormValid ? 0.5 : 1 }}
          >
            <Text className="text-white text-lg font-semibold">
              {isLoading ? "Creating Account..." : "Create Account →"}
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center mb-8">
            <Text className="text-[#94A3B8]">Already have an account? </Text>
            <TouchableOpacity onPress={navigateToLogin}>
              <Text className="text-[#2DD4BF] font-semibold">Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
