import { createClient as createServerClient } from '@/lib/supabase/server';
import { supabaseServiceClient } from '../supabase/server-service-client';
import { unstable_cache } from 'next/cache';

export const getDashboardData = async () => {
  const supabase = await createServerClient();

  // ❗ Get the user FIRST (outside cache)
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('No authenticated user found');

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
    ['dashboard-data'], // cache key base
    { revalidate: 60 * 60, tags: ['dashboard-data'] }
  )(user.id);
  return cachedData;
};

export const getStorePayoutDetails = (storeId: number) => {
  const cachedData = unstable_cache(
    async (storeId: number) => {
      const { data, error } = await supabaseServiceClient.rpc(
        'get_store_payout_details',
        {
          p_store_id: storeId,
        }
      );
      if (error) throw new Error('Error fetching store details');

      let result = data as any;
      if (typeof result === 'string') result = JSON.parse(result);

      return result;
    },
    [`store-payouts-detail-${storeId}`], // unique static tag per store
    { revalidate: 60 * 60, tags: [`store-payouts-detail-${storeId}`] }
  )(storeId);
  return cachedData;
};
