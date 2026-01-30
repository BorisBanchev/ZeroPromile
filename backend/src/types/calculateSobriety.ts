export interface UserCalculationData {
  weightKg: number;
  distributionFactor: number;
}

export interface Drink {
  time: number;
  bac: number;
}

export interface DrinkInput {
  name: string;
  volumeMl: number;
  abv: number;
  timeSinceStart: number;
}

export interface TimeUntilSoberResult {
  currentBac: number;
  untilSober: {
    hours: number;
    minutes: number;
  };
}

export interface CreateSessionRequestBody {
  name: string;
}

export interface CreateSessionResponseBody {
  status: string;
  message: string;
  data: {
    sessionId: string;
    name: string;
    active: boolean;
    startedAt: string;
  };
}
