import { unstable_cache } from 'next/cache';
import { supabaseServiceClient } from '../supabase/server-service-client';

export const getDashboardData = unstable_cache(
  async (userId: string) => {
    const { data, error } = await supabaseServiceClient.rpc(
      'get_dashboard_totals',
      {
        p_user_id: userId,
      }
    );
    if (error) throw new Error('Error fetching dashboard totals');
    return {
      lastFetched: new Date().toLocaleTimeString(), // store timestamp in cache
      data,
    };
  },
  ['dashboard-data'], // cache key base
  { revalidate: 60 * 60, tags: ['dashboard-data'] }
);

export const getStorePayoutDetails = (storeId: number) =>
  unstable_cache(
    async () => {
      const { data, error } = await supabaseServiceClient.rpc(
        'get_store_payout_details',
        {
          p_store_id: storeId,
        }
      );
      if (error) throw new Error('Error fetching store details');

      let result = data as any;
      if (typeof result === 'string') result = JSON.parse(result);
      return {
        lastFetched: new Date().toLocaleTimeString(), // store timestamp in cache
        result,
      };
    },
    [`store-payouts-detail-${storeId}`], // unique static tag per store
    { revalidate: 60 * 60, tags: [`store-payouts-detail-${storeId}`] }
  )();
