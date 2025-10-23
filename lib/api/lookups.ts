'use server';

import { createClient as createServerClient } from '@/lib/supabase/server';
import { unstable_cache } from 'next/cache';
import { OptionsType } from '@/types/type';

export const getGlobalOptions = async () => {
  const supabase = await createServerClient();

  // ❗ Get the user FIRST (outside cache)
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('No authenticated user found');

  const cacheKey = 'global-options';
  // ✅ Cache only what depends on user ID
  const cachedData = unstable_cache(
    async (userId: string) => {
      const [
        { data },
        { data: stores },
        { data: companies },
        { data: types },
        { data: departments },
      ] = await Promise.all([
        supabase.from('users').select('role').eq('id', userId),
        supabase
          .from('user_stores')
          .select('store:stores(id, name)')
          .eq('user_id', userId),
        supabase.from('companies').select('*'),
        supabase.from('types').select('*'),
        supabase.from('departments').select('*'),
      ]);

      const userStores: OptionsType = (stores ?? []).flatMap(
        (item) => item.store
      );

      return {
        userRole: data ? data[0].role : 'user',
        storeOptions: userStores,
        companyOptions: companies ?? [],
        typeOptions: types ?? [],
        departmentOptions: departments ?? [],
      };
    },
    [cacheKey],
    { revalidate: 60 * 60, tags: [cacheKey] }
  )(user.id); // Pass user.id to cache key
  return cachedData;
};
