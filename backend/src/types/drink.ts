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

export interface DrinkSnapshot {
  consumedAt: string;
  bacContribution: number;
}
