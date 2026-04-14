const dateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export const formatDateForSoberAt = (date: Date | null) => {
  if (!date) return "--:--";
  return dateFormatter.format(date);
};

export const formatDateForSessionsData = (date: Date | null) => {
  if (!date) return { dateString: "--:--", timeString: "--:--" };
  const dateAndTime = dateFormatter.format(date);
  const dateString = dateAndTime.split(" at ")[0];
  const timeString = dateAndTime.split(" at ")[1];
  return { dateString, timeString };
};
