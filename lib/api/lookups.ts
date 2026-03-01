'use server';

import { createClient as createServerClient } from '@/lib/supabase/server';
import { unstable_cache } from 'next/cache';

export const getGlobalOptions = async () => {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('No authenticated user found');

  const cachedData = unstable_cache(
    async () => {
      const [
        { data },
        { data: stores },
        { data: companies },
        { data: types },
        { data: departments },
      ] = await Promise.all([
        supabase.from('users').select('role').eq('id', user.id).single(),
        supabase
          .from('user_stores')
          .select('store:stores(id, name)')
          .eq('user_id', user.id),
        supabase.from('companies').select('*'),
        supabase.from('types').select('*'),
        supabase.from('departments').select('*'),
      ]);

      return {
        userRole: data?.role ?? 'user',
        storeOptions: (stores ?? []).flatMap((item) => item.store),
        companyOptions: companies ?? [],
        typeOptions: types ?? [],
        departmentOptions: departments ?? [],
      };
    },
    ['global-options', user.id], // ✅ FIX: include user.id
    {
      revalidate: 60 * 60,
      tags: ['global-options', `global-options-${user.id}`],
    },
  )();

  return cachedData;
};
