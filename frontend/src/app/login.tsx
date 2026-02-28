import React, { useState } from "react";
import { StatusBar, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../store/useAuthStore";
import { LoginCredentials } from "../types/auth";
import { Notification } from "../components/ui/Notification";
import { AuthHeader } from "../components/auth/AuthHeader";
import { EmailInput } from "../components/auth/EmailInput";
import { PasswordInput } from "../components/auth/PasswordInput";
import { AuthButton } from "../components/auth/AuthButton";
import { AuthFooter } from "../components/auth/AuthFooter";

export default function LoginScreen() {
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleLogin = async (): Promise<void> => {
    const credentials: LoginCredentials = { email, password };
    await login(credentials);
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0A1628" />
      <SafeAreaView className="flex-1 bg-[#0A1628]" edges={["top", "bottom"]}>
        <Notification />
        <View className="flex-1 px-6 justify-center">
          <AuthHeader
            LogoText="ZP"
            headerBluish={["Zero", "Promile"]}
            subheader="Know when you are safe"
          />
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
          <AuthButton
            onPressFunction={handleLogin}
            isLoading={isLoading}
            email={email}
            password={password}
            buttonText="Login ->"
            loadingButtonText="Logging In..."
          />
          <View className="flex-row justify-center">
            <AuthFooter
              description="Do not have an account?"
              navigateText="Sign Up"
            />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}
