import { DrinkSnapshot } from "./drinks";

export interface Session {
  sessionId: string;
  sessionName: string;
  totalDrinks: number;
  drinks: DrinkSnapshot[];
  peakBac: number;
  startedAt: string;
  endedAt: string | null;
  active: boolean;
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

export interface GetSessionsResponse {
  status: string;
  message: string;
  data: {
    sessions: Session[];
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
