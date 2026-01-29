import { describe, it, expect, test } from "vitest";

import {
  drinkToBAC,
  currentBAC,
  timeUntilSober,
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
});
