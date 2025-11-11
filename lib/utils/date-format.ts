import { startOfDay, endOfDay, addMinutes, format } from 'date-fns';

// EST offset
const EST_OFFSET_MINUTES = -5 * 60; // -5 hours

export function getUtcRangeFromEST(date: Date) {
  // start/end of EST day
  const estStart = startOfDay(date);
  const estEnd = endOfDay(date);

  // Shift EST → UTC
  const startUtc = addMinutes(estStart, -EST_OFFSET_MINUTES);
  const endUtc = addMinutes(estEnd, -EST_OFFSET_MINUTES);

  return { startUtc, endUtc };
}

export function formatUtcAsEst(utcDate: string | Date) {
  const date = new Date(utcDate);
  const estDate = date.toLocaleDateString('en-US', {
    timeZone: 'America/New_York',
  });

  return format(new Date(estDate), 'yyyy-MM-dd');
}

// Convert an EST date to UTC midnight
export function convertEstDateToUtc(estDate: Date) {
  const estStart = startOfDay(estDate);
  const utcDate = addMinutes(estStart, -EST_OFFSET_MINUTES);
  return utcDate;
}
