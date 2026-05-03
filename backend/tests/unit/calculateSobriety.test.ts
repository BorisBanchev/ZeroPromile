import {
  drinkToBAC,
  currentBAC,
  timeUntilSober,
  hoursToHoursAndMinutes,
  soberTimeToMinutes,
} from "./../../src/utils/calculateSobriety";
import { describe, it, expect } from "vitest";

describe("drinkToBAC", () => {
  it("calculates BAC for a standard beer", () => {
    const bac = drinkToBAC(500, 5, 80, 0.68);
    expect(bac).toBeCloseTo(0.363, 3);
  });

  it("calculates higher BAC for females (lower r factor)", () => {
    const maleBac = drinkToBAC(500, 5, 80, 0.68);
    const femaleBac = drinkToBAC(500, 5, 80, 0.55);
    expect(femaleBac).toBeGreaterThan(maleBac);
  });

  it("returns 0 for 0% ABV", () => {
    expect(drinkToBAC(500, 0, 80, 0.68)).toBe(0);
  });

  it("returns 0 for 0 volume", () => {
    expect(drinkToBAC(0, 5, 80, 0.68)).toBe(0);
  });
});

describe("currentBAC", () => {
  it("returns 0 for empty drinks array", () => {
    expect(currentBAC([], Date.now())).toBe(0);
  });

  it("returns full BAC immediately after drinking", () => {
    const now = Date.now();
    const bac = currentBAC([{ time: now, bac: 0.5 }], now);
    expect(bac).toBeCloseTo(0.5, 3);
  });

  it("metabolizes alcohol over time", () => {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    const bac = currentBAC([{ time: oneHourAgo, bac: 0.3 }], Date.now());
    expect(bac).toBeCloseTo(0.15, 3);
  });

  it("returns 0 when fully metabolized", () => {
    const threeHoursAgo = Date.now() - 3 * 60 * 60 * 1000;
    const bac = currentBAC([{ time: threeHoursAgo, bac: 0.3 }], Date.now());
    expect(bac).toBe(0);
  });

  it("accumulates multiple drinks", () => {
    const now = Date.now();
    const drinks = [
      { time: now - 30 * 60 * 1000, bac: 0.3 },
      { time: now, bac: 0.3 },
    ];
    const bac = currentBAC(drinks, now);
    expect(bac).toBeCloseTo(0.525, 3);
  });

  it("changes negative BAC to 0", () => {
    const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;
    const bac = currentBAC([{ time: twoHoursAgo, bac: 0.2 }], Date.now());
    expect(bac).toBe(0);
  });
});

describe("timeUntilSober", () => {
  it("returns zero for sober person", () => {
    const result = timeUntilSober(0);
    expect(result).toEqual({
      currentBac: 0,
      untilSober: { hours: 0, minutes: 0 },
    });
  });

  it("calculates time for 0.3 promilles", () => {
    const result = timeUntilSober(0.3);
    expect(result.currentBac).toBe(0.3);
    expect(result.untilSober).toEqual({ hours: 2, minutes: 0 });
  });

  it("rounds minutes correctly", () => {
    const result = timeUntilSober(0.225);
    expect(result.untilSober).toEqual({ hours: 1, minutes: 30 });
  });
});

describe("hoursToHoursAndMinutes", () => {
  it("converts whole hours", () => {
    expect(hoursToHoursAndMinutes(2)).toEqual({ hours: 2, minutes: 0 });
  });

  it("converts fractional hours", () => {
    expect(hoursToHoursAndMinutes(1.5)).toEqual({ hours: 1, minutes: 30 });
  });

  it("handles less than one hour", () => {
    expect(hoursToHoursAndMinutes(0.25)).toEqual({ hours: 0, minutes: 15 });
  });
});

describe("soberTimeToMinutes", () => {
  it("converts to total minutes", () => {
    const time = { currentBac: 0.3, untilSober: { hours: 2, minutes: 30 } };
    expect(soberTimeToMinutes(time)).toBe(150);
  });
});
