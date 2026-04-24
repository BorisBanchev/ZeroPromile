import { Session } from "./session";

export interface UserCalculationData {
  weightKg: number;
  distributionFactor: number;
}

export interface TimeUntilSoberResult {
  currentBac: number;
  untilSober: {
    hours: number;
    minutes: number;
  };
}

export interface StartSessionRequestBody {
  sessionName: string;
}

export interface StartSessionResponseBody {
  status: string;
  message: string;
  data: {
    sessionId: string;
    sessionName: string;
    active: boolean;
  };
}

export interface AddDrinkRequestBody {
  drink: {
    name: string;
    volumeMl: number;
    abv: number;
  };
}

export interface AddDrinkResponseBody {
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
    peakBac: number;
    currentBAC: number;
    timeUntilSobriety: {
      hours: number;
      minutes: number;
    };
  };
}

export interface EndSessionResponseBody {
  status: string;
  message: string;
  data: {
    sessionId: string;
    sessionName: string;
    active: boolean;
  };
}

export interface DeleteSessionResponseBody {
  status: string;
  message: string;
  data: {
    sessionId: string;
    sessionName: string;
  };
}

export interface DeleteSessionRequestParams {
  sessionId: string;
}

export interface GetSessionsResponseBody {
  status: string;
  message: string;
  data: {
    sessions: Session[];
  };
}
