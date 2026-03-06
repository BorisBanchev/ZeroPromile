import React, { useState } from "react";
import { useRouter } from "expo-router";
import { AddDrinkModal } from "@/src/components/modals/quickAddDrink/AddDrinkModal";

export default function AddDrinkScreen() {
  const router = useRouter();
  const [showCustom, setShowCustom] = useState(false);

  const handleCancel = () => router.back();
  const handleSuccess = () => router.back();

  return (
    <>
      <AddDrinkModal
        visible={!showCustom}
        onCancel={handleCancel}
        onSuccess={handleSuccess}
        onCustomDrink={() => console.log("custom drink pressed")}
      />
    </>
  );
}
