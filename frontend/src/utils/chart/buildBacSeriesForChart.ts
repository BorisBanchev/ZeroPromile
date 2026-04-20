import { DrinkSnapshot } from "@/src/types/drinks";
import { BacChartPoint } from "@/src/types/chart";
import { calculateCurrentBAC } from "../calculateBAC";

export const buildBacSeriesForChart = (
  drinks: DrinkSnapshot[],
  startedAt: string,
  endedAt: string | null,
): BacChartPoint[] => {
  const startMs = new Date(startedAt).getTime();
  const endMs = new Date(endedAt ?? Date.now()).getTime();

  const eventTimes = [
    startMs,
    ...drinks.map((d) => new Date(d.consumedAt).getTime()),
    endMs,
  ];

  const uniqueSortedTimes = Array.from(new Set(eventTimes))
    .filter((t) => t >= startMs && t <= endMs)
    .sort((a, b) => a - b);

  return uniqueSortedTimes.map((t) => {
    const drinkAtTime = drinks.find(
      (d) => new Date(d.consumedAt).getTime() === t,
    );
    const drinksConsumedByNow = drinks.filter(
      (d) => new Date(d.consumedAt).getTime() <= t,
    );

    return {
      time: t,
      bac: calculateCurrentBAC(drinksConsumedByNow, t),
      drink: drinkAtTime
        ? {
            consumedAt: drinkAtTime.consumedAt,
            bacContribution: drinkAtTime.bacContribution,
            drinkName: drinkAtTime.drinkName,
            volumeMl: drinkAtTime.volumeMl,
            abv: drinkAtTime.abv,
          }
        : undefined,
    };
  });
};
