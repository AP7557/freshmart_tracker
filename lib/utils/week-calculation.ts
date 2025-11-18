/**
 * Get the ISO date string (YYYY-MM-DD) in New York time
 */
function toNYDateString(date: Date) {
  return date.toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
}

/**
 * Get current week boundaries (Monday-Sunday) in New York time
 */
export function getCurrentWeek(): { weekStart: string; weekEnd: string } {
  const now = new Date();

  // Calculate Monday
  const d = new Date(now);
  const day = d.getDay(); // 0=Sun, 1=Mon, ...
  const weekShift = day === 1 ? -7 : 0; // your original logic
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) + weekShift;
  const monday = new Date(d.setDate(diff));
  monday.setHours(0, 0, 0, 0);

  // Calculate Sunday
  const sunday = new Date(monday);
  sunday.setDate(sunday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return {
    weekStart: toNYDateString(monday), // "YYYY-MM-DD"
    weekEnd: toNYDateString(sunday), // "YYYY-MM-DD"
  };
}