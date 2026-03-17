import React, { useState } from "react";
import { View } from "react-native";
import { parseNumber } from "@/src/utils/parseNumber";
import { AddDrinkButton } from "../AddDrinkButton";
import { DrinkNameInput } from "./DrinkNameInput";
import { DrinkStepper } from "./DrinkStepper";
import { BackToQuickSelectButton } from "./BackToQuickSelectButton";
import { useNotificationStore } from "@/src/store/useNotificationStore";

export interface CustomDrinkPayload {
  name: string;
  volumeMl: number;
  abv: number;
}

interface CustomDrinkFormProps {
  isLoading: boolean;
  onBack: () => void;
  onSubmit: (payload: CustomDrinkPayload) => Promise<void> | void;
}

export const CustomDrinkForm = ({
  isLoading,
  onBack,
  onSubmit,
}: CustomDrinkFormProps) => {
  const [name, setName] = useState("");
  const [volumeInput, setVolumeInput] = useState("330");
  const [abvInput, setAbvInput] = useState("5");
  const setError = useNotificationStore((state) => state.setError);

  const incrementVolume = () => {
    const current = parseNumber(volumeInput, false) ?? 0;
    setVolumeInput(String(current + 10));
  };

  const decrementVolume = () => {
    const current = parseNumber(volumeInput, false) ?? 1;
    setVolumeInput(String(Math.max(1, current - 10)));
  };

  const incrementAbv = () => {
    const current = parseNumber(abvInput, true) ?? 0.1;
    const next = Math.round((current + 0.1) * 10) / 10;
    setAbvInput(next.toFixed(1));
  };

  const decrementAbv = () => {
    const current = parseNumber(abvInput, true) ?? 0.1;
    const next = Math.max(0.1, Math.round((current - 0.1) * 10) / 10);
    setAbvInput(next.toFixed(1));
  };

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    const volume = parseNumber(volumeInput, false);
    const abv = parseNumber(abvInput, true);

    if (!trimmedName) {
      setError("Drink name is required");
      return;
    }

    if (volume === null || volume <= 0) {
      setError("Volume must be a positive number");
      return;
    }
    if (abv === null || abv <= 0) {
      setError("ABV must be greater than 0.1");
      return;
    }

    await onSubmit({
      name: trimmedName,
      volumeMl: volume,
      abv,
    });
  };

  return (
    <View>
      <DrinkNameInput
        value={name}
        onChangeValue={setName}
        disabled={isLoading}
      />

      <DrinkStepper
        label="Volume (ml)"
        value={volumeInput}
        onChangeValue={setVolumeInput}
        onIncrement={incrementVolume}
        onDecrement={decrementVolume}
        disabled={isLoading}
      />

      <DrinkStepper
        label="Alcohol % (ABV)"
        value={abvInput}
        unit="%"
        onChangeValue={setAbvInput}
        onIncrement={incrementAbv}
        onDecrement={decrementAbv}
        disabled={isLoading}
      />

      <BackToQuickSelectButton onPress={onBack} disabled={isLoading} />

      <AddDrinkButton
        onPress={handleSubmit}
        isLoading={isLoading}
        disabled={isLoading}
      />
    </View>
  );
};
