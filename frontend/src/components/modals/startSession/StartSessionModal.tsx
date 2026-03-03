import React, { useState } from "react";
import {
  Modal,
  View,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useNotificationStore } from "@/src/store/useNotificationStore";
import sessionsService from "@/src/services/sessions";
import { StartSessionHeader } from "./StartSessionHeader";
import { StartSessionForm } from "./StartSessionForm";
import { StartSessionButton } from "./StartSessionButton";

interface StartSessionModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

export const StartSessionModal: React.FC<StartSessionModalProps> = ({
  visible,
  onCancel,
  onSuccess,
}) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setError = useNotificationStore((state) => state.setError);
  const setSuccess = useNotificationStore((state) => state.setSuccess);

  const [sessionName, setSessionName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isFormValid = sessionName.trim().length > 0;

  const handleStartSession = async () => {
    if (!isFormValid || !accessToken) {
      setError("Not authenticated");
      return;
    }

    setIsLoading(true);
    try {
      await sessionsService.startSession(accessToken, sessionName.trim());
      setSuccess("Session started successfully!");
      setSessionName("");
      onSuccess();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to start session",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setSessionName("");
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <Pressable
          className="flex-1 bg-black/50 justify-center items-center px-5"
          onPress={handleCancel}
        >
          <Pressable
            className="bg-[#1A1F2E] rounded-3xl w-full max-w-md"
            onPress={(e) => e.stopPropagation()}
          >
            <StartSessionHeader onClose={handleCancel} isLoading={isLoading} />

            <View className="px-6 py-6">
              <StartSessionForm
                sessionName={sessionName}
                onChangeSessionName={setSessionName}
                isLoading={isLoading}
                onSubmit={handleStartSession}
              />

              <StartSessionButton
                onPress={handleStartSession}
                isLoading={isLoading}
                disabled={!isFormValid}
              />
            </View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
};
