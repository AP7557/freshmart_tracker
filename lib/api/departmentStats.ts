'use server';

import { createClient as createServerClient } from '@/lib/supabase/server';
import { revalidateTag, unstable_cache } from 'next/cache';
import { supabaseServiceClient } from '../supabase/server-service-client';
import { subMonths } from 'date-fns';

type DepartmentStats = {
  amount: number;
  date: Date;
  stores: { name: string };
  departments: { name: string };
};

export const addDepartmentStats = async (values: {
  storeId: number;
  storeName: string;
  monthYear: Date;
  departments: {
    department: string;
    amount: number;
  }[];
}) => {
  const supabase = await createServerClient();

  const { data, error } = await supabase.rpc('insert_department_stats', {
    p_store_name: values.storeName,
    p_date: values.monthYear,
    p_departments: values.departments,
  });

  if (error) {
    console.error('Error Adding Payouts', error);
    return;
  }

  revalidateTag(`store-departments-stats-${values.storeId}`);
  revalidateTag(`last-two-months-department-stats-${values.storeId}`);
  return { data };
};

export const getLastTwoMonthsDepartmentStats = async (storeId: number) => {
  const cacheKey = `last-two-months-department-stats-${storeId}`;
  const cachedData = unstable_cache(
    async (storeId: number) => {
      const startOfTwoMonthsAgo = subMonths(new Date(), 2);
      startOfTwoMonthsAgo.setDate(1);

      const { data, error } = await supabaseServiceClient
        .from('department_stats')
        .select(
          `date, 
          amount,
          stores (name),
          departments (name)`
        )
        .eq('store_id', storeId)
        .gte('date', startOfTwoMonthsAgo.toISOString().split('T')[0])
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching department stats:', error);
        return { data: [] };
      }

      const formattedData = (data as unknown as DepartmentStats[]).map((d) => {
        return {
          amount: d.amount,
          date: d.date,
          store_name: d.stores.name,
          department_name: d.departments.name,
        };
      });

      return { data: formattedData };
    },
    [cacheKey],
    {
      revalidate: 60 * 1440, //1 day
      tags: [cacheKey, `store-specific-data-${storeId}`],
    }
  )(storeId);
  return cachedData;
};
