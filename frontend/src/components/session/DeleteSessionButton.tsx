import { useState } from "react";
import { ActivityIndicator, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CustomAlert } from "@/src/components/ui/CustomAlert";
import { useAuthStore } from "@/src/store/useAuthStore";
import sessionsService from "@/src/services/sessions";
import { useNotificationStore } from "@/src/store/useNotificationStore";

interface DeleteSessionButtonProps {
  sessionId: string;
  sessionName: string;
  onDeleted: () => void;
}

export default function DeleteSessionButton({
  sessionId,
  sessionName,
  onDeleted,
}: DeleteSessionButtonProps) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setSuccess = useNotificationStore((state) => state.setSuccess);
  const setError = useNotificationStore((state) => state.setError);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleDelete = () => {
    setShowAlert(true);
  };

  const confirmDelete = async () => {
    if (!accessToken) return;

    setShowAlert(false);

    try {
      setLoading(true);
      await sessionsService.deleteSession(accessToken, sessionId);
      setSuccess("Session deleted successfully");
      onDeleted();
    } catch (error) {
      console.error("Delete session failed:", error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("There was an error deleting the session");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={handleDelete}
        disabled={loading}
        activeOpacity={0.7}
        className="bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl p-3 flex-row"
      >
        {loading ? (
          <ActivityIndicator size="small" color="#EF4444" />
        ) : (
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
        )}
      </TouchableOpacity>

      <CustomAlert
        visible={showAlert}
        title="Delete Session"
        message={`Are you sure you want to delete "${sessionName}"? This action cannot be undone.`}
        onCancel={() => setShowAlert(false)}
        onConfirm={confirmDelete}
        cancelText="Cancel"
        confirmText="Delete"
      />
    </>
  );
}
