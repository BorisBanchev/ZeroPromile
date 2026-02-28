import React, { useState } from "react";
import { Text, StatusBar, View, ScrollView } from "react-native";
import { AuthHeader } from "../components/auth/AuthHeader";
import { NameInput } from "../components/auth/RegisterPage/NameInput";
import { EmailInput } from "../components/auth/EmailInput";
import { PasswordInput } from "../components/auth/PasswordInput";
import { SafeAreaView } from "react-native-safe-area-context";
import { RegisterCredentials } from "../types/auth";
import { useAuthStore } from "../store/useAuthStore";
import { Notification } from "../components/ui/Notification";
import { ConfirmPasswordInput } from "../components/auth/RegisterPage/ConfirmPasswordInput";
import { GenderInput } from "../components/auth/RegisterPage/GenderInput";
import { WeightInput } from "../components/auth/RegisterPage/WeightInput";
import { AuthButton } from "../components/auth/AuthButton";
import { AuthFooter } from "../components/auth/AuthFooter";

export default function RegisterScreen() {
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
          <AuthHeader
            LogoText="ZP"
            header="Create Account"
            subheader="Join ZeroPromile today"
          />
          <Notification />
          <View className="mb-4">
            <NameInput fullName={fullName} setFullName={setFullName} />
          </View>
          <View className="mb-4">
            <EmailInput email={email} setEmail={setEmail} />
          </View>
          <View className="mb-4">
            <PasswordInput
              password={password}
              setPassword={setPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />
          </View>
          <View className="mb-4">
            <ConfirmPasswordInput
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
            />
          </View>
          <View className="mb-4">
            <Text className="text-[#94A3B8] text-sm mb-3">
              Gender (for BAC calculation)
            </Text>
            <GenderInput gender={gender} setGender={setGender} />
          </View>
          <View className="mb-6">
            <WeightInput weight={weight} setWeight={setWeight} />
            <Text className="text-[#64748B] text-xs mt-2 ml-1">
              Required for accurate BAC calculation
            </Text>
          </View>
          <AuthButton
            onPressFunction={handleRegister}
            isLoading={isLoading}
            isFormValid={isFormValid}
            buttonText="Create Account ->"
            loadingButtonText="Creating Account..."
          />
          <View className="flex-row justify-center mb-8">
            <AuthFooter
              description="Already have an account?"
              navigateText="Sign In"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
