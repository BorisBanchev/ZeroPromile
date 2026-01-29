import { Drink, TimeUntilSoberResult } from "../types/calculateSobriety";

const ETHANOLDENSITY: number = 0.789;
const BETA: number = 0.15;

export const drinkToBAC = (
  volumeMl: number,
  abv: number,
  weightKg: number,
  r: number,
): number => {
  const grams: number = volumeMl * (abv / 100) * ETHANOLDENSITY;
  return grams / (weightKg * r);
};

export const currentBAC = (drinks: Drink[], tNow: number): number => {
  let currentBac = 0;

  for (const d of drinks) {
    const elapsed: number = tNow - d.time;
    const remainingBAC: number = Math.max(0, d.bac - BETA * elapsed);
    currentBac += remainingBAC;
  }
  return Math.max(0, currentBac);
};

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
