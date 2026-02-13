import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, Alert } from "react-native";
import { useRouter, Link } from "expo-router";
import { useAuthStore } from "../../store/useAuthStore";
import { Input } from "../shared/Input";
import { Button } from "../shared/Button";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await login({ email, password });
      router.replace("/");
    } catch (error: unknown) {
      if (error instanceof Error) Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Login to your account</Text>

      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
        editable={!isLoading}
      />

      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="password"
        editable={!isLoading}
      />

      <Button title="Login" onPress={handleLogin} isLoading={isLoading} />

      <Link href="/register" asChild disabled={isLoading}>
        <Pressable
          disabled={isLoading}
          style={({ pressed }) => [
            styles.linkContainer,
            pressed && styles.linkPressed,
          ]}
        >
          <Text style={styles.linkText}>
            Don&apos;t have an account?{" "}
            <Text style={styles.linkBold}>Sign up</Text>
          </Text>
        </Pressable>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 32,
    textAlign: "center",
  },
  linkContainer: {
    marginTop: 16,
    alignItems: "center",
    paddingVertical: 8,
  },
  linkPressed: {
    opacity: 0.6,
  },
  linkText: {
    color: "#666",
    fontSize: 14,
  },
  linkBold: {
    color: "#007AFF",
    fontWeight: "600",
  },
});
