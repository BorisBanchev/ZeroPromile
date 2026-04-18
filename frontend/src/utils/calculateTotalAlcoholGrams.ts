import { DrinkSnapshot } from "./calculateBAC";

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
