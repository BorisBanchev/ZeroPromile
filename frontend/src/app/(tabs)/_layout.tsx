import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#3B82F6",
        tabBarInactiveTintColor: "#64748B",
        tabBarStyle: {
          backgroundColor: "#1E293B",
          borderTopColor: "#334155",
          borderTopWidth: 1,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          paddingBottom: 4,
        },
        tabBarBackground: () => (
          <SafeAreaView
            edges={["bottom"]}
            style={{ flex: 1, backgroundColor: "#1E293B" }}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name={"home-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="sessions"
        options={{
          title: "Sessions",
          tabBarLabel: "Sessions",
          tabBarIcon: ({ color }) => (
            <Ionicons name={"time-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarLabel: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons name={"person-outline"} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
