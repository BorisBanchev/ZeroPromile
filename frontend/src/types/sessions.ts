import { DrinkSnapshot } from "../utils/calculateBAC";
export interface ActiveSession {
  sessionId: string;
  sessionName: string;
  totalDrinks: number;
  drinks: DrinkSnapshot[];
  startedAt: string;
  endedAt: string;
}

export interface GetActiveSessionResponse {
  status: string;
  message: string;
  data: {
    sessionId: string;
    sessionName: string;
    totalDrinks: number;
    drinks: DrinkSnapshot[];
    startedAt: string;
    endedAt: string;
  };
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
