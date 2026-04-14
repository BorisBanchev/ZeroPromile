import { API_URL } from "../config/apiUrl";
import { useAuthStore } from "../store/useAuthStore";
import { ErrorResponse } from "../types/error";
import {
  GetSessionsResponse,
  EndSessionResponse,
  StartSessionResponse,
} from "../types/sessions";

const getSessions = async (
  accessToken: string,
): Promise<GetSessionsResponse> => {
  const response = await fetch(`${API_URL}/sessions`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data: GetSessionsResponse | ErrorResponse = await response.json();

  if (response.status === 401) {
    const newToken = await useAuthStore.getState().refreshAccessToken();
    return getSessions(newToken);
  }

  if ("error" in data) {
    throw new Error(data.error || "Failed to fetch sessions");
  }

  if (!response.ok) {
    throw new Error("Failed to fetch sessions");
  }

  return data;
};

const startSession = async (
  accessToken: string,
  sessionName: string,
): Promise<StartSessionResponse> => {
  const response = await fetch(`${API_URL}/sessions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ sessionName }),
  });

  const data: StartSessionResponse | ErrorResponse = await response.json();

  if (response.status === 401) {
    const newToken = await useAuthStore.getState().refreshAccessToken();
    return startSession(newToken, sessionName);
  }

  if ("error" in data) {
    throw new Error(data.error || "Failed to start session");
  }
  if (!response.ok) {
    throw new Error("Failed to start session");
  }

  return data;
};

const endSession = async (accessToken: string): Promise<EndSessionResponse> => {
  const response = await fetch(`${API_URL}/sessions/endsession`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data: EndSessionResponse | ErrorResponse = await response.json();

  if (response.status === 401) {
    const newToken = await useAuthStore.getState().refreshAccessToken();
    return endSession(newToken);
  }

  if ("error" in data) {
    throw new Error(data.error || "Failed to end session");
  }
  if (!response.ok) {
    throw new Error("Failed to end session");
  }

  return data;
};

export default {
  startSession,
  endSession,
  getSessions,
};
