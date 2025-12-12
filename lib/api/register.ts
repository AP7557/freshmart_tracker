'use server';
import { createClient as createServerClient } from '@/lib/supabase/server';

import { getCurrentWeekDateUTC } from '../utils/week-calculation';
import { RegisterForm } from '@/app/portal/stats/register/page';

type TotalsSummary = {
  totalEntries: {
    business: number;
    payout: number;
    card: number;
    overShort: number;
    cash: number;
  };
  totalPayoutAmount: number;
  pbLastWeek: number;
  totalAdditionalCash: number;
  pbThisWeek: number;
};

export const getOrCreateWeekEntry = async (storeId: number) => {
  const { weekStart, weekEnd } = getCurrentWeekDateUTC();
  const supabase = await createServerClient();

  const { data, error } = await supabase.rpc('insert_register_week', {
    p_store_id: storeId,
    p_week_start: weekStart,
    p_week_end: weekEnd,
  });

  if (error) {
    console.error('Error Getting Week Entry:', error);
    return null;
  }

  return data;
};

export const createRegisterWeekWithNoPB = async (
  pdLastWeek: number,
  storeId: number
) => {
  const { weekStart, weekEnd } = getCurrentWeekDateUTC();
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('register_weeks')
    .insert([
      {
        store_id: storeId,
        week_start: weekStart,
        week_end: weekEnd,
        pb_last_week: pdLastWeek,
      },
    ])
    .select('id')
    .single();

  if (error) {
    console.error('Error Creating New Week:', error);
    return null;
  }

  return data;
};

export const getDailyEntries = async (weekId: number) => {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('register_daily_entries')
    .select('*')
    .eq('register_week_id', weekId)
    .order('entry_date', { ascending: true }); // sorts by date ascending

  if (error) {
    console.error('Error Getting daily entry:', error);
    return null;
  }

  return data;
};

export const addDailyEntry = async (
  values: RegisterForm['entries'][0] & { weekId: number }
) => {
  const supabase = await createServerClient();

  const { data, error } = await supabase.rpc('insert_register_daily_entry', {
    p_register_week_id: values.weekId,
    p_entry_date: values.entry_date,
    p_business: values.business,
    p_payout: values.payout,
    p_card: values.card,
    p_over_short: values.over_short,
  });

  if (error) {
    console.error('Error adding daily entry:', error);
    return null;
  }

  return data;
};

export const updateDailyEntry = async (values: RegisterForm['entries'][0]) => {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('register_daily_entries')
    .update({
      entry_date: values.entry_date,
      business: values.business,
      payout: values.payout,
      card: values.card,
      over_short: values.over_short,
    })
    .eq('id', values.entry_id)
    .select('cash');

  if (error) {
    console.error('Error Updating daily entry:', error);
    return null;
  }

  return data;
};

export const deleteDailyEntry = async (id: number) => {
  const supabase = await createServerClient();

  const { error } = await supabase
    .from('register_daily_entries')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error Updating daily entry:', error);
    return null;
  }
};

export const getWeeklyPayoutOrAdditionalCash = async (
  weekId: number,
  dbName: string
) => {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from(dbName)
    .select('*')
    .eq('register_week_id', weekId);

  if (error) {
    console.error('Error Getting daily entry:', error);
    return null;
  }

  return data;
};

export const addWeeklyPayoutOrAdditionalCash = async (
  values: { week_id: number; name: string; amount: number }[],
  rpcName: string
) => {
  const supabase = await createServerClient();

  const { data, error } = await supabase.rpc(rpcName, {
    p_items: values,
  });

  if (error) {
    console.error(`Error adding weekly :`, error);
    return null;
  }

  return data;
};

export const updateWeeklyPayoutOrAdditionalCash = async (
  values: RegisterForm['payouts'][0],
  dbName: string
) => {
  const supabase = await createServerClient();

  const { error } = await supabase
    .from(dbName)
    .update({
      name: values.name,
      amount: values.amount,
    })
    .eq('id', values.id);

  if (error) {
    console.error('Error Updating Weekly Payout:', error);
  }
};

export const deleteWeeklyPayoutOrAdditionalCash = async (
  id: number,
  dbName: string
) => {
  const supabase = await createServerClient();

  const { error } = await supabase.from(dbName).delete().eq('id', id);

  if (error) {
    console.error('Error Deleting Weekly Payout:', error);
    return null;
  }
};

export const updateWeeklySummary = async (
  id: number,
  totals: TotalsSummary
) => {
  const supabase = await createServerClient();

  const { error } = await supabase
    .from('register_weeks')
    .update({
      total_business: totals.totalEntries.business,
      total_payout: totals.totalEntries.payout,
      total_card: totals.totalEntries.card,
      total_cash: Math.round(totals.totalEntries.cash),
      total_over_short: totals.totalEntries.overShort,
      pb_this_week: Math.round(totals.pbThisWeek),
    })
    .eq('id', id);

  if (error) {
    console.error('Failed to update weekly summary', error);
  }
};
