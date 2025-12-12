import { getCurrentWeekDateUTC } from '@/lib/utils/week-calculation';
import { UserTimeLog, UserWeek } from '@/types/type';
import { addDays, format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

export const EST_WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// --- Pair logs IN → OUT per employee ---
export function pairLogs(data: UserTimeLog[]) {
  return Object.values(
    data.reduce<Record<number, UserTimeLog[]>>((acc, log) => {
      (acc[log.finger_id] ??= []).push(log);
      return acc;
    }, {})
  )
    .map((logs) =>
      logs.sort((a, b) => a.timestamp_utc.localeCompare(b.timestamp_utc))
    )
    .flatMap((logs) => {
      const result: {
        name: string;
        finger_id: number;
        timeStampEst_In: Date;
        timeStampEst_Out: Date;
      }[] = [];
      let lastIn = null;

      for (const log of logs) {
        if (log.action === 'IN') {
          lastIn = log;
        } else if (log.action === 'OUT' && lastIn) {
          result.push({
            name: log.name,
            finger_id: log.finger_id,
            timeStampEst_In: toZonedTime(
              lastIn.timestamp_utc + 'Z',
              'America/New_York'
            ),
            timeStampEst_Out: toZonedTime(
              log.timestamp_utc + 'Z',
              'America/New_York'
            ),
          });
          lastIn = null;
        }
      }

      return result;
    });
}

// --- Build employee week with proper day assignment and overnight support ---
export function buildEmployeeWeeks(rawLogs: UserTimeLog[]) {
  const employees: Record<string, UserWeek> = {};
  const { weekStart } = getCurrentWeekDateUTC();
  const pairs = pairLogs(rawLogs);

  for (const pair of pairs) {
    if (!employees[pair.name]) {
      employees[pair.name] = {
        name: pair.name,
        finger_id: pair.finger_id,
        days: {},
        totalMinutes: 0,
      };
      let current: string | Date = weekStart;

      for (let i = 0; i < 7; i++) {
        current = addDays(current, 1);

        const estDate = toZonedTime(current, 'America/New_York');
        const dateStr = format(estDate, 'yyyy-MM-dd'); // e.g., "2025-12-08"

        employees[pair.name].days[dateStr] = {
          date: dateStr,
          shifts: [],
        };
      }
      // Move to next day
    }
    const startTimestampEST = format(
      pair.timeStampEst_In.toLocaleDateString(),
      'yyyy-MM-dd'
    );

    if (startTimestampEST in employees[pair.name].days) {
      employees[pair.name].days[startTimestampEST]?.shifts.push({
        in: pair.timeStampEst_In.toLocaleTimeString(),
        out: pair.timeStampEst_Out.toLocaleTimeString(),
        minutes: Math.round(
          (pair.timeStampEst_Out.getTime() - pair.timeStampEst_In.getTime()) /
            60000
        ),
      });

      employees[pair.name].totalMinutes += Math.round(
        (pair.timeStampEst_Out.getTime() - pair.timeStampEst_In.getTime()) /
          60000
      );
    }
    console.log(employees[pair.name]);
  }
  return employees;
}
