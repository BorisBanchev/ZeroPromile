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

export interface StartSessionRequestBody {
  sessionName: string;
  drink: {
    name: string;
    volumeMl: number;
    abv: number;
  };
}

export interface StartSessionResponseBody {
  status: string;
  message: string;
  data: {
    sessionName: string;
    drink: {
      name: string;
      volumeMl: number;
      abv: number;
    };
    timeUntilSobriety: {
      hours: number;
      minutes: number;
    };
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
    };
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

export interface TimelineDataPoint {
  consumedAt: string;
  bacLevel: number;
  drinkName: string;
}

export interface GetSessionTimelineResponseBody {
  status: string;
  message: string;
  data: {
    sessionId: string;
    sessionName: string;
    startedAt: string;
    endedAt: string | null;
    active: boolean;
    timeline: TimelineDataPoint[];
  };
}
