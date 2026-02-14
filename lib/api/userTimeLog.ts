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

  return data; // Raw UTC logs
}


export async function getDeviceStatus(storeId: number) {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('device_status')
    .select('last_seen, pending_count')
    .eq('store_id', storeId)
    .single();

  if (error) throw error;

  const isOnline =
    new Date(data.last_seen).getTime() >
    Date.now() - 5 * 60 * 60 * 1000;

  return {
    ...data,
    status: isOnline ? 'online' : 'offline',
  };
}
