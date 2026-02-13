import { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../store/useAuthStore";
import { useRouter } from "expo-router";
import { Button } from "../components/shared/Button";

export default function Index() {
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !accessToken) {
      router.replace("/login");
    }
  }, [isInitialized, accessToken, router]);

  if (!isInitialized) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </SafeAreaView>
    );
  }

  if (!accessToken) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Home Screen</Text>
          {user && (
            <>
              <Text style={styles.welcome}>Welcome, {user.name}!</Text>
            </>
          )}
        </View>

        <View style={styles.footer}>
          <Button title="Logout" onPress={handleLogout} variant="danger" />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    paddingVertical: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#1a1a1a",
  },
  welcome: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  footer: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 20,
  },
});
