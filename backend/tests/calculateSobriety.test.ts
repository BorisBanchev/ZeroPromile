import { describe, it, expect, test } from "vitest";

import {
  drinkToBAC,
  currentBAC,
  timeUntilSober,
  soberTimeToMinutes,
} from "../src/utils/calculateSobriety";

import {
  UserCalculationData,
  Drink,
  DrinkInput,
  TimeUntilSoberResult,
} from "../src/types/calculateSobriety";

describe("BAC timer simulation", () => {
  it("should correctly update sober time when first drink is added", () => {
    const drinks: Drink[] = [];
    let testUser: UserCalculationData = {
      weightKg: 80,
      distributionFactor: 0.68,
    };
    const timeSinceFirstDrink: number = 0;
    let firstDrink: DrinkInput = {
      name: "Beer",
      volumeMl: 330,
      abv: 5.5,
      timeSinceStart: 0,
    };

    const bac1: number = drinkToBAC(
      firstDrink.volumeMl,
      firstDrink.abv,
      testUser.weightKg,
      testUser.distributionFactor,
    );
    drinks.push({ time: 0, bac: bac1 });
    const currBac: number = currentBAC(drinks, timeSinceFirstDrink);
    const timeUntilSoberAndCurrBac: TimeUntilSoberResult =
      timeUntilSober(currBac);
    expect(currBac).toBeCloseTo(0.26, 2);
    expect(timeUntilSoberAndCurrBac.untilSober.hours).toBe(1);
    expect(timeUntilSoberAndCurrBac.untilSober.minutes).toBe(45);
  });
  it("should correctly increase sobriety timer after adding second drink", () => {
    const drinks: Drink[] = [];
    let testUser: UserCalculationData = {
      weightKg: 80,
      distributionFactor: 0.68,
    };
    const timeSinceFirstDrink: number = 0;
    const firstDrink: DrinkInput = {
      name: "Beer",
      volumeMl: 330,
      abv: 5.5,
      timeSinceStart: 0,
    };

    const bac1: number = drinkToBAC(
      firstDrink.volumeMl,
      firstDrink.abv,
      testUser.weightKg,
      testUser.distributionFactor,
    );
    drinks.push({ time: 0, bac: bac1 });

    const timeNow = 0;
    const currBac = currentBAC(drinks, timeNow);
    const timeUntilSoberAndCurrBac: TimeUntilSoberResult =
      timeUntilSober(currBac);
    const soberMinutes1: number = soberTimeToMinutes(timeUntilSoberAndCurrBac);

    const timeNow2 = 1;
    const secondDrink: DrinkInput = {
      name: "Wine",
      volumeMl: 125,
      abv: 12,
      timeSinceStart: timeNow2,
    };
    const bac2 = drinkToBAC(
      secondDrink.volumeMl,
      secondDrink.abv,
      testUser.weightKg,
      testUser.distributionFactor,
    );
    drinks.push({ time: timeNow2, bac: bac2 });

    const currBac2 = currentBAC(drinks, timeNow2);
    const timeUntilSoberAndCurrBac2: TimeUntilSoberResult =
      timeUntilSober(currBac2);
    const soberMinutes2: number = soberTimeToMinutes(timeUntilSoberAndCurrBac2);

    expect(currBac2).toBeCloseTo(0.33, 2);
    expect(soberMinutes2).toBeGreaterThan(soberMinutes1);
  });
});
