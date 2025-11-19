export function getCurrentWeekUTC(): { weekStart: string; weekEnd: string } {
  const nowUTC = new Date();

  const day = nowUTC.getUTCDay(); // 0=Sun..6=Sat
  const diff = nowUTC.getUTCDate() - day + (day === 0 ? -6 : 1); // Monday calc

  const monday = new Date(
    Date.UTC(nowUTC.getUTCFullYear(), nowUTC.getUTCMonth(), diff)
  );

  const sunday = new Date(monday);
  sunday.setUTCDate(sunday.getUTCDate() + 6);

  return {
    weekStart: monday.toISOString().slice(0, 10),
    weekEnd: sunday.toISOString().slice(0, 10),
  };
}
