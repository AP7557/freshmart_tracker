'use server';

import { createClient as createServerClient } from '@/lib/supabase/server';
import { getCurrentWeekDateUTC } from '../utils/week-calculation';

export async function getTimeLogsForWeek(storeId: number) {
  const supabase = await createServerClient();
  const { weekStart } = getCurrentWeekDateUTC(); // YYYY-MM-DD (UTC Monday)

  const startUtc = new Date(`${weekStart}T00:00:00Z`);
  const endUtc = new Date(startUtc);
  endUtc.setUTCDate(endUtc.getUTCDate() + 7);

  // extra buffer for overnight shifts
  const bufferedStart = new Date(startUtc);
  bufferedStart.setUTCDate(bufferedStart.getUTCDate() - 1);

  const bufferedEnd = new Date(endUtc);
  bufferedEnd.setUTCDate(bufferedEnd.getUTCDate() + 1);

  const { data, error } = await supabase
    .from('time_logs')
    .select('*')
    .eq('store_id', storeId)
    .gte('timestamp_utc', bufferedStart.toISOString())
    .lt('timestamp_utc', bufferedEnd.toISOString())
    .order('timestamp_utc', { ascending: true });

  if (error) throw error;

  console.log(data);
  return data; // Raw UTC logs
}
