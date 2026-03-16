import { API_URL } from "../config/apiUrl";
import { useAuthStore } from "../store/useAuthStore";
interface UpdateProfileData {
  gender: "male" | "female";
  weight: number;
}

interface UpdateProfileResponse {
  status: string;
  data: {
    gender: string;
    weightKg: number;
  };
}

const updateUserProfile = async (
  accessToken: string,
  data: UpdateProfileData,
): Promise<UpdateProfileResponse> => {
  const response = await fetch(`${API_URL}/update/profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });
  const responseData = await response.json();

  if (response.status === 401) {
    const newToken = await useAuthStore.getState().refreshAccessToken();
    if (!newToken) throw new Error("Session expired. Please log in again.");
    return updateUserProfile(newToken, data);
  }

  if (!response.ok) {
    throw new Error(responseData.error || "Failed to update profile");
  }
  return responseData;
};

export default {
  updateUserProfile,
};
