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
  if (!date) {
    return { dateString: "--", timeString: "--" };
  }

  const dateString = date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  const timeString = date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return { dateString, timeString };
};
