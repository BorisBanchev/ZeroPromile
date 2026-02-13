import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter, Link } from "expo-router";
import { useAuthStore } from "../../store/useAuthStore";
import { Input } from "../shared/Input";
import { Button } from "../shared/Button";

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [weight, setWeight] = useState("");

  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  const router = useRouter();

  const handleRegister = async () => {
    const weightKg = parseFloat(weight);

    try {
      await register({ name, email, password, gender, weightKg });
      router.replace("/");
    } catch (error: any) {
      Alert.alert("Registration Failed", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Sign up to get started</Text>

      <Input
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        editable={!isLoading}
      />

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

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={gender}
          onValueChange={setGender}
          enabled={!isLoading}
        >
          <Picker.Item label="Male" value="male" />
          <Picker.Item label="Female" value="female" />
        </Picker>
      </View>

      <Input
        placeholder="Weight (kg)"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
        editable={!isLoading}
      />

      <Button title="Sign Up" onPress={handleRegister} isLoading={isLoading} />

      <Link href="/login" asChild disabled={isLoading}>
        <Pressable
          disabled={isLoading}
          style={({ pressed }) => [
            styles.linkContainer,
            pressed && styles.linkPressed,
          ]}
        >
          <Text style={styles.linkText}>
            Already have an account? <Text style={styles.linkBold}>Login</Text>
          </Text>
        </Pressable>
      </Link>
    </View>
  );
}

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
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#fff",
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
