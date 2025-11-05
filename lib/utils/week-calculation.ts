function getWeekStart(date: Date) {
  const d = new Date(date);

  const day = d.getDay(); // 0 sun, 1 mon, 2 tue, 3 wed, 4 thurs, 5 fri, 6 sat, 7 sun

  // if today is monday → shift back 7 days
  const weekShift = day === 1 ? -7 : 0;

  // normal monday logic
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) + weekShift;

  const monday = new Date(d.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

/**
 * Get the end of the week (Sunday) for a given date
 */
export function getWeekEnd(date: Date): Date {
  const weekStart = getWeekStart(date);
  const sunday = new Date(weekStart);
  sunday.setDate(sunday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return sunday;
}

/**
 * Get current week boundaries (Monday-Sunday)
 */
export function getCurrentWeek(): { weekStart: string; weekEnd: string } {
  const now = new Date();
  return {
    weekStart: getWeekStart(now).toLocaleDateString('en-US', {
      timeZone: 'America/New_York',
    }),
    weekEnd: getWeekEnd(now).toLocaleDateString('en-US', {
      timeZone: 'America/New_York',
    }),
  };
}

/**
 * Format date to YYYY-MM-DD string
 */
export function formatDateForDB(date: Date): string {
  return date.toISOString().split('T')[0];
}
