import React, { useState } from "react";
import {
  StatusBar,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuthStore } from "../store/useAuthStore";
import { useNotificationStore } from "../store/useNotificationStore";
import { LoginCredentials } from "../types/auth";

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const notification = useNotificationStore((state) => state.notification);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleLogin = async (): Promise<void> => {
    const credentials: LoginCredentials = { email, password };
    await login(credentials);
  };

  const navigateToRegister = (): void => {
    router.push("/register");
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0A1628" />
      <SafeAreaView className="flex-1 bg-[#0A1628]" edges={["top", "bottom"]}>
        {notification && notification.type === "success" && (
          <View className="mb-4 bg-green-500 border border-green-500 rounded-2xl px-4 py-3 flex-row items-center">
            <Ionicons name="checkmark-circle-outline" size={20} color="green" />
            <Text className="text-white ml-2 flex-1">
              {notification.message}
            </Text>
          </View>
        )}
        <View className="flex-1 px-6 justify-center">
          <View className="items-center mb-12">
            <View className="w-24 h-24 bg-[#2DD4BF] rounded-3xl items-center justify-center mb-5">
              <Text className="text-white text-4xl font-bold">ZP</Text>
            </View>
            <Text className="text-white text-4xl font-bold mb-2">
              Zero<Text className="text-[#2DD4BF]">Promile</Text>
            </Text>
            <Text className="text-[#94A3B8] text-base">
              Know when you&apos;re safe
            </Text>
          </View>

          {notification && notification.type === "error" && (
            <View className="mb-4 bg-red-500/20 border border-red-500 rounded-2xl px-4 py-3 flex-row items-center">
              <Ionicons name="alert-circle-outline" size={20} color="#EF4444" />
              <Text className="text-red-500 ml-2 flex-1">
                {notification.message}
              </Text>
            </View>
          )}

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

          <TouchableOpacity
            className="rounded-2xl py-4 items-center mb-6 bg-[#2DD4BF]"
            onPress={handleLogin}
            disabled={isLoading || !email || !password}
            style={{ opacity: isLoading || !email || !password ? 0.5 : 1 }}
          >
            <Text className="text-white text-lg font-semibold">
              {isLoading ? "Signing in..." : "Sign In →"}
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center">
            <Text className="text-[#94A3B8]">Don&apos;t have an account? </Text>
            <TouchableOpacity onPress={navigateToRegister}>
              <Text className="text-[#2DD4BF] font-semibold">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}
