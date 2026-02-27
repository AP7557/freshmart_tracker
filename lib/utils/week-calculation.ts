import { addDays, subDays } from "date-fns";

export function getCurrentWeekDateUTC(offsetDays: number = 0): {
  weekStart: string;
  weekEnd: string;
} {
  const nowUTC = new Date();

  const d = new Date(
    Date.UTC(nowUTC.getUTCFullYear(), nowUTC.getUTCMonth(), nowUTC.getUTCDate())
  );

  const day = d.getUTCDay(); // 0 Sun, 1 Mon, 2 Tue, ... 6 Sat

  // // Get this week's Monday normally
  // const thisMonday = new Date(d);
  // const offsetToMonday = (day + 6) % 7; // turns Mon=0, Tue=1, ..., Sun=6
  // thisMonday.setUTCDate(d.getUTCDate() - offsetToMonday);

  // const weekStart = new Date(thisMonday);

  const offsetToMonday = (day + 6) % 7;
  let weekStart = subDays(d, offsetToMonday);
  // apply offset (0 = this week, -7 = last week)
  weekStart = addDays(weekStart, offsetDays);

  // // Special rule: if today is Monday/Tuesday → go to last week
  // if (day === 1 || day === 2) {
  //   weekStart.setUTCDate(thisMonday.getUTCDate() - 7);
  // }

  // // Week end = Monday + 6
  // const weekEnd = new Date(weekStart);
  // weekEnd.setUTCDate(weekStart.getUTCDate() + 6);
  
  const weekEnd = addDays(weekStart, 6);
  
  return {
    weekStart: weekStart.toISOString().slice(0, 10),
    weekEnd: weekEnd.toISOString().slice(0, 10),
  };
}
