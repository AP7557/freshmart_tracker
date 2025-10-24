'use server';

import { createClient } from '@/lib/supabase/server';
import { RevalidateButton } from './revalidateButton';
import { revalidateTag } from 'next/cache';

async function revalidateCacheTag(tag: string) {
  'use server';
  revalidateTag(tag);
  console.log(`✅ Revalidated: ${tag}`);
}

export default async function TestCachePage() {
  // Create Supabase client
  const supabase = await createClient();

  // Fetch all stores dynamically
  const { data: stores, error } = await supabase.from('stores').select('*');
  if (error) {
    console.error('Error fetching stores', error);
  }

  const cacheSections = [
    { name: 'Dashboard Data', cacheKey: 'dashboard-data' },
    { name: 'Global Options', cacheKey: 'global-options' },
    { name: "Today's Payouts", cacheKey: 'todays-payouts' },
    { name: 'Payouts to Post', cacheKey: 'payouts-to-post' },
    { name: 'All Users', cacheKey: 'all-users' },
  ];

  return (
    <div className='p-8 max-w-4xl mx-auto space-y-6'>
      <h1 className='text-3xl font-bold mb-6'>🧠 Cache Management Panel</h1>
      <p className='text-muted-foreground text-sm'>
        Admin-only page to manually revalidate cached data.
      </p>

      <div className='grid gap-6'>
        {cacheSections.map(({ name, cacheKey }) => (
          <section
            key={cacheKey}
            className='rounded-xl border p-4 bg-card shadow-sm flex items-center justify-between'
          >
            <div>
              <h2 className='text-lg font-semibold'>{name}</h2>
            </div>
            <RevalidateButton
              tag={cacheKey}
              label={name}
              revalidateAction={revalidateCacheTag}
            />
          </section>
        ))}

        {/* Dynamically render store cache sections */}
        {stores?.map((store) => {
          const storeCacheKey = `store-payouts-detail-${store.id}`;
          return (
            <section
              key={storeCacheKey}
              className='rounded-xl border p-4 bg-card shadow-sm flex items-center justify-between'
            >
              <div>
                <h2 className='text-lg font-semibold'>
                  Store Payout Details ({store.id}): {store.name}
                </h2>
              </div>
              <RevalidateButton
                tag={storeCacheKey}
                label={store.name}
                revalidateAction={revalidateCacheTag}
              />
            </section>
          );
        })}
      </div>
    </div>
  );
}
