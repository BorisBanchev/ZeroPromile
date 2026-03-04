import { API_URL } from "../config/apiUrl";
import { useAuthStore } from "../store/useAuthStore";
import { DrinkSnapshot } from "../utils/calculateBAC";

export interface ActiveSession {
  sessionId: string;
  sessionName: string;
  currentBAC: number;
  timeUntilSobriety: {
    hours: number;
    minutes: number;
  };
  totalDrinks: number;
  drinks: DrinkSnapshot[];
}

export interface StartSessionRequest {
  sessionName: string;
}

export interface StartSessionResponse {
  status: string;
  message: string;
  data: {
    sessionId: string;
    sessionName: string;
    active: boolean;
  };
}

export interface SessionSummary {
  sessionId: string;
  sessionName: string;
  startedAt: string;
  endedAt: string | null;
  active: boolean;
  totalDrinks: number;
}

export interface GetSessionsResponse {
  status: string;
  message: string;
  data: {
    sessions: SessionSummary[];
  };
}

export interface EndSessionResponse {
  status: string;
  message: string;
  data: {
    sessionId: string;
    sessionName: string;
    active: boolean;
  };
}

const getSessions = async (
  accessToken: string,
): Promise<GetSessionsResponse> => {
  const response = await fetch(`${API_URL}/sessions`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (response.status === 401) {
    const newToken = await useAuthStore.getState().refreshAccessToken();
    if (!newToken) throw new Error("Session expired. Please log in again.");
    return getSessions(newToken);
  }

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch sessions");
  }

  return data;
};

const getActiveSession = async (
  accessToken: string,
): Promise<ActiveSession | null> => {
  try {
    const response = await fetch(`${API_URL}/sessions/active`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (response.status === 404) return null;

    const json = await response.json();
    return json.data as ActiveSession;
  } catch (error) {
    console.error(error);
    return null;
  }
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

  const data = await response.json();

  if (response.status === 401) {
    const newToken = await useAuthStore.getState().refreshAccessToken();
    if (!newToken) throw new Error("Session expired. Please log in again.");
    return startSession(newToken, sessionName);
  }

  if (!response.ok) {
    throw new Error(data.error || "Failed to start session");
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

  const data = await response.json();

  if (response.status === 401) {
    const newToken = await useAuthStore.getState().refreshAccessToken();
    if (!newToken) throw new Error("Session expired. Please log in again.");
    return endSession(newToken);
  }

  if (!response.ok) {
    throw new Error(data.error || "Failed to end session");
  }

  return data;
};

export default {
  startSession,
  endSession,
  getSessions,
  getActiveSession,
};
