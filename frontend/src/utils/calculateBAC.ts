const BETA = 0.15;
const HOURS_MS = 1000 * 60 * 60;
export interface DrinkSnapshot {
  consumedAt: string;
  bacContribution: number;
}

export const calculateCurrentBAC = (
  drinks: DrinkSnapshot[],
  tNowMs: number = Date.now(),
): number => {
  if (!drinks.length) return 0;

  const events = drinks
    .map((d) => ({
      time: new Date(d.consumedAt).getTime(),
      bac: Math.max(0, d.bacContribution),
    }))
    .sort((a, b) => a.time - b.time);
  if (!events.length) return 0;
  let bac = 0;
  let lastTime = events[0].time;

  for (const e of events) {
    const elapsedHours = Math.max(0, (e.time - lastTime) / HOURS_MS);
    bac = Math.max(0, bac - BETA * elapsedHours);
    bac += e.bac;
    lastTime = e.time;
  }

  const elapsedToNowHours = Math.max(0, (tNowMs - lastTime) / HOURS_MS);
  return Math.max(0, bac - BETA * elapsedToNowHours);
};

export const calculateTimeUntilSober = (
  bac: number,
): { hours: number; minutes: number; seconds: number } => {
  const totalSeconds = Math.ceil((bac / BETA) * 3600);

  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
};
