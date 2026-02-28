import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNotificationStore } from "@/src/store/useNotificationStore";

export const Notification = () => {
  const notification = useNotificationStore((state) => state.notification);

  return (
    <>
      {notification && notification.type === "success" && (
        <View className="mb-4 bg-green-500 border border-green-500 rounded-2xl px-4 py-3 flex-row items-center">
          <Ionicons name="checkmark-circle-outline" size={20} color="green" />
          <Text className="text-white ml-2 flex-1">{notification.message}</Text>
        </View>
      )}

      {notification && notification.type === "error" && (
        <View className="mb-4 bg-red-500/20 border border-red-500 rounded-2xl px-4 py-3 flex-row items-center">
          <Ionicons name="alert-circle-outline" size={20} color="#EF4444" />
          <Text className="text-red-500 ml-2 flex-1">
            {notification.message}
          </Text>
        </View>
      )}
    </>
  );
};
