import React from "react";
import { Modal, View, Text, TouchableOpacity, Pressable } from "react-native";

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  cancelText?: string;
  confirmText?: string;
}

export const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  onCancel,
  onConfirm,
  cancelText = "Cancel",
  confirmText = "Confirm",
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable
        className="flex-1 bg-black/50 justify-center items-center"
        onPress={onCancel}
      >
        <Pressable
          className="bg-gray-900 rounded-2xl p-6 w-[85%] max-w-md"
          onPress={(e) => e.stopPropagation()}
        >
          <Text className="text-white text-xl font-bold mb-3 text-center">
            {title}
          </Text>
          <Text className="text-gray-400 text-base mb-6 text-center leading-6">
            {message}
          </Text>

          <View className="flex-row gap-3">
            <TouchableOpacity
              className="flex-1 bg-gray-800 border border-gray-700 py-3 px-4 rounded-lg"
              onPress={onCancel}
            >
              <Text className="text-white text-center text-base font-semibold">
                {cancelText}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 bg-red-600 py-3 px-4 rounded-lg"
              onPress={onConfirm}
            >
              <Text className="text-white text-center text-base font-semibold">
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
