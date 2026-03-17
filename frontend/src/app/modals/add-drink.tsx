import React from "react";
import { useRouter } from "expo-router";
import { AddDrinkModal } from "@/src/components/modals/quickAddDrink/AddDrinkModal";

export default function AddDrinkScreen() {
  const router = useRouter();

  return (
    <AddDrinkModal
      visible={true}
      onCancel={() => router.back()}
      onSuccess={() => router.back()}
    />
  );
}
