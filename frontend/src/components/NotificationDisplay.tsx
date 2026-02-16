import React from "react";
import { View, Text } from "react-native";
import { useNotificationStore } from "../store/useNotificationStore";

export const NotificationDisplay = () => {
  const { notification } = useNotificationStore();

  if (!notification) return null;

  const isError = notification.type === "error";

  return (
    <View>
      <Text>{notification.message}</Text>
    </View>
  );
};
