import { Session } from "../types/sessions";

export const groupSessionsByMonth = (sessions: Session[]) => {
  const groups: Record<string, Session[]> = {};

  sessions.forEach((session) => {
    const date = new Date(session.startedAt);

    const key = date.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    if (!groups[key]) {
      groups[key] = [];
    }

    groups[key].push(session);
  });

  return groups;
};
