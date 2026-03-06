import { API_URL } from "../config/apiUrl";
import { useAuthStore } from "../store/useAuthStore";

export interface AddDrinkRequest {
  drink: {
    name: string;
    volumeMl: number;
    abv: number;
  };
}

export interface AddDrinkResponse {
  status: string;
  message: string;
  data: {
    sessionId: string;
    drink: {
      name: string;
      volumeMl: number;
      abv: number;
      consumedAt: string;
      bacContribution: number;
    };
    currentBAC: number;
    timeUntilSobriety: {
      hours: number;
      minutes: number;
    };
  };
}

const addDrink = async (
  accessToken: string,
  data: AddDrinkRequest,
): Promise<AddDrinkResponse> => {
  const response = await fetch(`${API_URL}/sessions/drinks`, {
    method: "POST",
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
    return addDrink(newToken, data);
  }

  if (!response.ok) {
    throw new Error(responseData.error || "Failed to add drink to session");
  }

  return responseData;
};

export default {
  addDrink,
};
