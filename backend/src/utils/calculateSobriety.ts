import { Drink, TimeUntilSoberResult } from "../types/calculateSobriety";

const ETHANOLDENSITY: number = 0.789;
const BETA: number = 0.15;

// returns promilles
export const drinkToBAC = (
  volumeMl: number,
  abv: number,
  weightKg: number,
  r: number,
): number => {
  const grams: number = volumeMl * (abv / 100) * ETHANOLDENSITY;
  return grams / (weightKg * r);
};

// returns current total promilles since session started
export const currentBAC = (drinks: Drink[], tNowMs: number): number => {
  let currentBac = 0;

  for (const d of drinks) {
    const elapsedHours: number = Math.max(
      0,
      (tNowMs - d.time) / (1000 * 60 * 60),
    );
    const remainingBAC: number = Math.max(0, d.bac - BETA * elapsedHours);
    currentBac += remainingBAC;
  }
  return Math.max(0, currentBac);
};

// returns time until complete sobriety in hours and minutes
export const timeUntilSober = (
  bac: number,
): { currentBac: number; untilSober: { hours: number; minutes: number } } => {
  return { currentBac: bac, untilSober: hoursToHoursAndMinutes(bac / BETA) };
};

export const hoursToHoursAndMinutes = (
  time: number,
): { hours: number; minutes: number } => {
  const hours: number = Math.floor(time);
  const minutes: number = Math.round((time - hours) * 60);
  return { hours, minutes };
};

export const soberTimeToMinutes = (time: TimeUntilSoberResult): number => {
  return time.untilSober.hours * 60 + time.untilSober.minutes;
};
