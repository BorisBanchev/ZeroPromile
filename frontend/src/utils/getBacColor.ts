export const getBacColor = (bac: number) => {
  if (bac === 0) return "#33d399";
  if (bac <= 0.5) return "#eab308";
  return "#ef4444";
};
