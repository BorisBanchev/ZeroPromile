import { API_URL } from "../config/apiUrl";

export interface ActiveSession {
  sessionId: string;
  sessionName: string;
  currectBAC: number;
  timeUntilSobriety: {
    hours: number;
    minutes: number;
  };
  totalDrinks: number;
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

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch sessions");
  }

  return data;
};

const getActiveSession = async (
  accessToken: string,
): Promise<ActiveSession | null> => {
  const data = await getSessions(accessToken);
  const activeSessionData = data.data.sessions.find((s) => s.active);

  if (!activeSessionData) {
    return null;
  }

  return {
    sessionId: activeSessionData.sessionId,
    sessionName: activeSessionData.sessionName,
    currentBAC: 0,
    timeUntilSobriety: {
      hours: 0,
      minutes: 0,
    },
    totalDrinks: activeSessionData.totalDrinks,
  };
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
