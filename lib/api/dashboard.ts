import { createClient as createServerClient } from '@/lib/supabase/server';
import { unstable_cache } from 'next/cache';
import { supabaseServiceClient } from '../supabase/server-service-client';

export const getDashboardData = async () => {
  const supabase = await createServerClient();

  // ❗ Get the user FIRST (outside cache)
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('No authenticated user found');

  const cacheKey = 'dashboard-data';
  const cachedData = unstable_cache(
    async (userId: string) => {
      const { data, error } = await supabaseServiceClient.rpc(
        'get_dashboard_totals',
        {
          p_user_id: userId,
        }
      );
      if (error) throw new Error('Error fetching dashboard totals');

      return data;
    },
    [cacheKey], // cache key base
    { revalidate: 60 * 60, tags: [cacheKey] } // 1 hr
  )(user.id);

  return cachedData;
};

export const getStorePayoutDetails = async (storeId: number) => {
  const cacheKey = `store-payouts-detail-${storeId}`;
  const cachedData = unstable_cache(
    async (storeId: number) => {
      const { data, error } = await supabaseServiceClient.rpc(
        'get_store_payout_details',
        {
          p_store_id: storeId,
        }
      );
      if (error) throw new Error('Error fetching store details');

      let result = data;
      if (typeof result === 'string') result = JSON.parse(result);

      return result;
    },
    [cacheKey], // unique static tag per store
    {
      revalidate: 60 * 60, // 1 hr
      tags: [cacheKey, `store-specific-data-${storeId}`],
    }
  )(storeId);

  return cachedData;
};

export const getDepartmentStatsForHeatMap = async (storeId: number) => {
  const cacheKey = `store-departments-stats-${storeId}`;
  const cachedData = unstable_cache(
    async (storeId: number) => {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      oneYearAgo.setMonth(0, 1); // Start from Jan of last year

      const { data, error } = await supabaseServiceClient
        .from('department_stats')
        .select(
          `
      amount,
      date,
      departments(name)
    `
        )
        .eq('store_id', storeId)
        .gte('date', oneYearAgo.toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching department trends:', error);
        throw error;
      }

      return (
        (
          data as unknown as {
            amount: number;
            date: string;
            departments: { name: string };
          }[]
        ).map((d) => ({
          amount: Number(d.amount),
          month: d.date,
          department_name: d.departments.name,
        })) ?? []
      );
    },
    [cacheKey],
    {
      revalidate: 60 * 1440, // 1 day
      tags: [cacheKey, `store-specific-data-${storeId}`],
    }
  )(storeId);
  return cachedData;
};
