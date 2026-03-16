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
  const HOURS_MS = 1000 * 60 * 60;
  if (!drinks.length) return 0;

  const events = drinks
    .map((d) => ({
      time: new Date(d.time).getTime(),
      bac: Math.max(0, d.bac),
    }))
    .sort((a, b) => a.time - b.time);
  if (!events.length) return 0;
  let bac = 0;
  let lastTime = events[0].time;

  for (const e of events) {
    const elapsedHours = Math.max(0, (e.time - lastTime) / HOURS_MS);
    bac = Math.max(0, bac - BETA * elapsedHours);
    bac += e.bac;
    lastTime = e.time;
  }

  const elapsedToNowHours = Math.max(0, (tNowMs - lastTime) / HOURS_MS);
  return Math.max(0, bac - BETA * elapsedToNowHours);
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
