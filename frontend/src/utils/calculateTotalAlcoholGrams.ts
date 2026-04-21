import { DrinkSnapshot } from "../types/drinks";

export const calculateSessionTotalAlcoholGrams = (
  drinks: DrinkSnapshot[],
  bodyWeightKg: number,
  r: number,
): number => {
  return drinks.reduce((sum, d) => {
    const grams = d.bacContribution * bodyWeightKg * r;
    return sum + grams;
  }, 0);
};

export const calculateDrinkAlcoholGrams = (
  drink: DrinkSnapshot,
  bodyWeightKg: number,
  r: number,
): number => {
  return drink.bacContribution * bodyWeightKg * r;
};
