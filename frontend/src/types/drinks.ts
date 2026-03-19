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
