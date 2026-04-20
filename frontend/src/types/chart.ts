import { DrinkSnapshot } from "./drinks";

export interface BacChartPoint {
  time: number;
  bac: number;
  drink?: DrinkSnapshot;
}
