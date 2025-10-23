'use server'; // at the top of lib/api/users.ts

import { createClient as createServerClient } from '@/lib/supabase/server';
import { revalidateTag, unstable_cache } from 'next/cache';
import { supabaseServiceClient } from '../supabase/server-service-client';

type GetAllUsersType = {
  user_name: string;
  id: string;
  user_email: string;
  role: string;
  user_stores: { stores: { id: number; name: string } }[];
};

export const getAllUsersAndStores = unstable_cache(
  async () => {
    const [usersResult, storesResult] = await Promise.all([
      supabaseServiceClient.from('users').select(`
        id, user_name, user_email, role,
        user_stores ( stores ( id, name ) )
      `),
      supabaseServiceClient.from('stores').select('*'),
    ]);

    const { data: userData, error: userError } = usersResult;
    const { data: storeData, error: storeError } = storesResult;

    if (userError) throw new Error('Error fetching users');
    if (storeError) throw new Error('Error fetching stores');

    const users = (userData as unknown as GetAllUsersType[]).map((u) => ({
      id: u.id,
      name: u.user_name,
      role: u.role,
      email: u.user_email,
      stores: u.user_stores.map((us) => us.stores),
    }));


    return {
      usersData: users,
      allStoresData: storeData,
    };
  },
  ['users-and-stores'], // cache key
  { revalidate: 60 * 60, tags: ['users-and-stores'] }
);

export const updateUserRole = async (userId: string, newRole: string) => {
  const supabase = await createServerClient();
  const { error } = await supabase
    .from('users')
    .update({ role: newRole })
    .eq('id', userId);
  if (error) throw new Error('Error updating user role');

  revalidateTag('global-options');
  revalidateTag('users-and-stores');
  revalidateTag('dashboard-data');
};

export async function updateUserStores(
  userId: string,
  storeId: number,
  remove: boolean
) {
  const supabase = await createServerClient();
  if (remove) {
    await supabase
      .from('user_stores')
      .delete()
      .eq('user_id', userId)
      .eq('store_id', storeId);
  } else {
    await supabase
      .from('user_stores')
      .insert({ user_id: userId, store_id: storeId });
  }

  revalidateTag('global-options');
  revalidateTag('users-and-stores');
  revalidateTag('dashboard-data');
}
