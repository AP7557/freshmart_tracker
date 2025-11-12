import { startOfDay, endOfDay } from 'date-fns';
import { toZonedTime, fromZonedTime, formatInTimeZone } from 'date-fns-tz';

const timeZone = 'America/New_York';

export function getUtcRangeFromEST(date: Date) {
  // 1. Interpret the input date in NY time
  const estDate = toZonedTime(date, timeZone);

  // 2. Get start and end of that day in NY local time
  const estStart = startOfDay(estDate);
  const estEnd = endOfDay(estDate);

  // 3. Convert NY local → UTC (DST-safe)
  const startUtc = fromZonedTime(estStart, timeZone);
  const endUtc = fromZonedTime(estEnd, timeZone);

  return { startUtc, endUtc };
}

export function formatUtcAsEst(utcDate: string | Date) {
  return formatInTimeZone(new Date(utcDate), timeZone, 'yyyy-MM-dd');
}