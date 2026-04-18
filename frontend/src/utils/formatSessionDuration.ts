export const formatSessionDuration = (startedAt: string) => {
  const start = new Date(startedAt).getTime();
  const now = Date.now();

  const diffMs = now - start;

  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes}min`;

  return `${hours}h ${minutes}min`;
};
