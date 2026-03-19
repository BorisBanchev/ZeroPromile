import { API_URL } from "../config/apiUrl";
import { useAuthStore } from "../store/useAuthStore";
import { AddDrinkRequest, AddDrinkResponse } from "../types/drinks";
import { ErrorResponse } from "../types/error";

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

  const responseData: AddDrinkResponse | ErrorResponse = await response.json();

  if (response.status === 401) {
    const newToken = await useAuthStore.getState().refreshAccessToken();
    return addDrink(newToken, data);
  }

  if ("error" in responseData) {
    throw new Error(responseData.error || "Failed to add drink to session");
  }

  if (!response.ok) {
    throw new Error("Failed to add drink to session");
  }

  return responseData;
};

export default {
  addDrink,
};
