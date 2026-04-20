import { DrinkSnapshot } from "../types/drinks";
import { buildBacSeriesForChart } from "../utils/chart/buildBacSeriesForChart";

export const useChartData = (
  drinks: DrinkSnapshot[],
  startedAt: string,
  endedAt: string | null,
) => {
  return buildBacSeriesForChart(drinks, startedAt, endedAt);
};
