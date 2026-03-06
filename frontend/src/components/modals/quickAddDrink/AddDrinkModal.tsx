import { useState } from "react";
import {
  Modal,
  View,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useNotificationStore } from "@/src/store/useNotificationStore";
import drinksService from "@/src/services/drinks";
import { AddDrinkHeader } from "./AddDrinkHeader";
import { QuickSelectGrid, QuickDrink } from "./QuickSelectGrid";
import { CustomDrinkButton } from "./CustomDrinkButton";
import { AddDrinkButton } from "./AddDrinkButton";

interface AddDrinkModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  onCustomDrink: () => void;
}

export const AddDrinkModal = ({
  visible,
  onCancel,
  onSuccess,
  onCustomDrink,
}: AddDrinkModalProps) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setError = useNotificationStore((state) => state.setError);
  const setSuccess = useNotificationStore((state) => state.setSuccess);

  const [selectedDrink, setSelectedDrink] = useState<QuickDrink | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = async () => {
    if (!selectedDrink || !accessToken) return;

    setIsLoading(true);
    try {
      await drinksService.addDrink(accessToken, {
        drink: {
          name: selectedDrink.name,
          volumeMl: selectedDrink.volumeMl,
          abv: selectedDrink.abv,
        },
      });
      setSuccess("Drink added!");
      setSelectedDrink(null);
      onSuccess();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to add drink");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedDrink(null);
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <Pressable
          className="flex-1 bg-black/50 justify-center items-center px-5"
          onPress={handleClose}
        >
          <Pressable
            className="bg-[#1A1F2E] rounded-3xl w-full max-w-md"
            onPress={(e) => e.stopPropagation()}
          >
            <AddDrinkHeader onClose={handleClose} />
            <View className="px-6 py-6">
              <QuickSelectGrid
                selectedDrink={selectedDrink}
                onSelect={setSelectedDrink}
              />
              <CustomDrinkButton onPress={onCustomDrink} />
              <AddDrinkButton
                onPress={handleAdd}
                isLoading={isLoading}
                disabled={!selectedDrink}
              />
            </View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
};
