import { DrinkSnapshot } from "./drink";

export interface Session {
  sessionId: string;
  sessionName: string;
  totalDrinks: number;
  drinks: DrinkSnapshot[];
  startedAt: string;
  endedAt: string | null;
  active: boolean;
}
