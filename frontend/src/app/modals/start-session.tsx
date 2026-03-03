import React from "react";
import { useRouter } from "expo-router";
import { StartSessionModal } from "@/src/components/modals/startSession/StartSessionModal";

export default function StartSessionScreen() {
  const router = useRouter();

  const handleCancel = () => {
    router.back();
  };

  const handleSuccess = () => {
    router.back();
  };

  return (
    <StartSessionModal
      visible={true}
      onCancel={handleCancel}
      onSuccess={handleSuccess}
    />
  );
}
