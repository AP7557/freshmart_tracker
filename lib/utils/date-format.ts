import { startOfDay, endOfDay, formatDistanceToNow } from 'date-fns';
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

export function formatUtcAsEstDate(utcDate: string | Date) {
  return formatInTimeZone(new Date(utcDate), timeZone, 'yyyy-MM-dd');
}

export const formatToEST = (utcDateString?: string) => {
  if (!utcDateString) return null;

  const timeZone = 'America/New_York';
  const date = new Date(utcDateString + 'Z');

  return {
    full: formatInTimeZone(
      date,
      timeZone,
      "MMM d, yyyy 'at' h:mm a"
    ),
    relative: formatDistanceToNow(date, { addSuffix: true }),
  };
};