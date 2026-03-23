const soberAtFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export const formatSoberAt = (date: Date | null) => {
  if (!date) return "--:--";
  return soberAtFormatter.format(date);
};
