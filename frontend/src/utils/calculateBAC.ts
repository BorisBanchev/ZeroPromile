const BETA = 0.15;

export interface DrinkSnapshot {
  consumedAt: string;
  bacContribution: number;
}

export const calculateCurrentBAC = (
  drinks: DrinkSnapshot[],
  tNowMs: number = Date.now(),
): number => {
  let total = 0;
  for (const d of drinks) {
    const elapsedHours = Math.max(
      0,
      (tNowMs - new Date(d.consumedAt).getTime()) / (1000 * 60 * 60),
    );
    total += Math.max(0, d.bacContribution - BETA * elapsedHours);
  }
  return total;
};

export const calculateTimeUntilSober = (
  bac: number,
): { hours: number; minutes: number; seconds: number } => {
  const totalSeconds = Math.max(0, Math.ceil((bac / BETA) * 3600));
  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
};
