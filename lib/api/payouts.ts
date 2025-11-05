'use server';

import { createClient as createServerClient } from '@/lib/supabase/server';
import { OptionsType } from '@/types/type';
import { revalidateTag, unstable_cache } from 'next/cache';
import { supabaseServiceClient } from '../supabase/server-service-client';
import { endOfToday, startOfToday } from 'date-fns';

type PayoutsType = {
  invoice_number: string;
  amount: number;
  check_number?: number;
  date_to_withdraw?: Date;
  company: { name: string };
  type: { name: string };
};

interface GetTodaysPayoutsType extends PayoutsType {
  id: number;
}

interface GetPayoutsToPostType extends PayoutsType {
  id: number;
  is_check_deposited: boolean;
  created_at: Date;
}

// ---------- ADD PAYOUT ----------
export const addPayout = async (
  values: {
    companyName: string;
    storeName: string;
    type: string;
    amount: number;
    invoiceNumber: string;
    checkNumber?: number;
    dateToWithdraw?: Date;
  },
  storeId: number,
  shouldInvalidateInitialData: { storeExists: boolean; companyExists: boolean }
) => {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase.rpc('insert_payout', {
    p_company_name: values.companyName,
    p_store_name: values.storeName,
    p_user_email: user?.email ?? null,
    p_type_name: values.type,
    p_amount: values.amount,
    p_invoice_number: values.invoiceNumber,
    p_check_number: values.checkNumber ?? null,
    p_date_to_withdraw: values.dateToWithdraw ?? null,
  });

  if (error) throw new Error('Error adding payout: ' + error.message);

  revalidateTag('dashboard-data');
  revalidateTag(`store-payouts-detail-${storeId}`);
  revalidateTag(`todays-payouts-${storeId}`);
  revalidateTag(`payouts-to-post-${storeId}`);
  if (
    !shouldInvalidateInitialData.storeExists ||
    !shouldInvalidateInitialData.companyExists
  ) {
    revalidateTag('global-options');
  }
  if (!shouldInvalidateInitialData.storeExists) {
    revalidateTag('users-and-stores');
  }

  return { data };
};

// ---------- UPDATE PAYOUT ----------
export const updatePayout = async (payoutId: number, storeId: number) => {
  const supabase = await createServerClient();
  const { error } = await supabase
    .from('payouts')
    .update({ is_check_deposited: true })
    .eq('id', payoutId);
  if (error) throw new Error('Error updating payout');

  revalidateTag('dashboard-data');
  revalidateTag(`store-payouts-detail-${storeId}`);
  revalidateTag(`payouts-to-post-${storeId}`);
};

// ---------- GET TODAY'S PAYOUTS ----------
export const getTodaysPayoutsCached = async (
  storeOptions: OptionsType,
  storeName: string
) => {
  const storeId = storeOptions.find((s) => s.name === storeName)?.id;
  if (!storeId) return;

  const cacheKey = `todays-payouts-${storeId}`;
  const cachedData = unstable_cache(
    async (storeId: number) => {
      const { data, error } = await supabaseServiceClient
        .from('payouts')
        .select(
          `
        id, invoice_number, amount, check_number, date_to_withdraw,
        company:companies(name),
        type:types(name),
        store:stores(name)
      `
        )
        .eq('store_id', storeId)
        .gte('created_at', startOfToday().toISOString())
        .lte('created_at', endOfToday().toISOString());

      if (error) throw new Error("Error fetching today's payouts");

      const payoutData = (
        (data as unknown as GetTodaysPayoutsType[]) ?? []
      ).map((p) => ({
        id: p.id,
        invoice_number: p.invoice_number,
        amount: p.amount,
        check_number: p.check_number,
        date_to_withdraw: p.date_to_withdraw,
        company_name: p.company.name,
        type_name: p.type.name,
        store_name: storeName,
      }));

      return { payoutData };
    },
    [cacheKey], // base cache key
    {
      revalidate: false,
      tags: [cacheKey, `store-specific-data-${storeId}`],
    } // revalidate only when tag 'payouts' is revalidated
  );

  return cachedData(storeId);
};

// ---------- GET PAYOUTS TO POST ----------
export const getPayoutsToPostCached = async (storeId: number) => {
  const cacheKey = `payouts-to-post-${storeId}`;
  const cachedData = unstable_cache(
    async (storeId: number) => {
      const { data, error } = await supabaseServiceClient
        .from('payouts')
        .select(
          `
        id, invoice_number, amount, check_number, date_to_withdraw,
        is_check_deposited, company:companies(name), type:types(name), created_at
      `
        )
        .eq('store_id', storeId)
        .or(
          `date_to_withdraw.gte.${
            new Date().toISOString().split('T')[0]
          },and(check_number.not.is.null,is_check_deposited.eq.false)`
        );

      if (error) {
        console.error('Supabase query error:', error);
        throw new Error('Error fetching payouts to post');
      }

      const sortedPayouts = (data ?? []).sort((a, b) => {
        //Check Payments First
        if (a.check_number && b.check_number)
          return a.check_number - b.check_number;
        if (a.check_number) return -1;
        if (b.check_number) return 1;

        //ACH Payments at Bottom by Date
        if (a.date_to_withdraw && b.date_to_withdraw)
          return (
            new Date(a.date_to_withdraw).getTime() -
            new Date(b.date_to_withdraw).getTime()
          );
        if (a.date_to_withdraw) return 1;
        if (b.date_to_withdraw) return -1;
        return 0;
      });

      const payoutData = (
        sortedPayouts as unknown as GetPayoutsToPostType[]
      ).map((p) => ({
        id: p.id,
        invoice_number: p.invoice_number,
        amount: p.amount,
        check_number: p.check_number,
        date_to_withdraw: p.date_to_withdraw,
        is_check_deposited: p.is_check_deposited,
        company_name: p.company.name,
        type_name: p.type.name,
        created_at: p.created_at,
      }));

      return { payoutData };
    },
    [cacheKey],
    {
      revalidate: false,
      tags: [cacheKey, `store-specific-data-${storeId}`],
    }
  );

  return cachedData(storeId);
};
