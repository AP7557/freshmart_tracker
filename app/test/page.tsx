// app/test-cache/page.tsx
'use server';
import { getDashboardData, getStorePayoutDetails } from '@/lib/api/dashboard'; // adjust path if needed
import { getInitialDashboardData } from '@/lib/api/lookups';
import {
  getTodaysPayoutsCached,
  getPayoutsToPostCached,
} from '@/lib/api/payouts';
import { getAllUsers } from '@/lib/api/users';
import { RevalidateButton } from './revlidatebuttoon';

export default async function TestCachePage() {
  // Example user and store for testing
  const testUserId = '56f48c44-4812-4f3e-bbe2-84d5da0af780';
  const testStoreId = 2;

  // Call cached functions with timestamps
  const dashboard = await getDashboardData(testUserId);
  const storeDetails = await getStorePayoutDetails(testStoreId);

  const initialData = await getInitialDashboardData();
  const todaysPayouts = await getTodaysPayoutsCached(
    initialData.storeOptions,
    initialData.storeOptions[0]?.name || ''
  );
  const payoutsToPost = await getPayoutsToPostCached(
    initialData.storeOptions,
    initialData.storeOptions[0]?.name || ''
  );
  const allUsers = await getAllUsers();

  return (
    <div className='p-6 space-y-6'>
      <h1 className='text-3xl font-bold mb-4'>Cache Test Page</h1>

      {[
        {
          name: 'Dashboard Data',
          cacheKey: 'dashboard-data',
          value: dashboard,
        },
        {
          name: 'Store Payout Details',
          cacheKey: `store-payouts-detail-${testStoreId}`,
          value: storeDetails,
        },
        {
          name: 'Initial Dashboard Data',
          cacheKey: 'initial-dashboard-data',
          value: initialData,
        },
        { name: "Today's Payouts", cacheKey: 'payouts', value: todaysPayouts },
        { name: 'Payouts to Post', cacheKey: 'payouts', value: payoutsToPost },
        { name: 'All Users', cacheKey: 'all-users', value: allUsers },
      ].map(({ name, cacheKey, value }, index) => (
        <section key={index}>
          <h2 className='text-xl font-semibold'>{name}</h2>
          <p className='text-sm text-muted-foreground'>
            Last fetched: {value.lastFetched}
          </p>
          <pre className='bg-gray-100 text-black p-2 rounded max-h-96 overflow-auto'>
            {JSON.stringify(value, null, 2)}
          </pre>
          <RevalidateButton tag={cacheKey} label={name} />
        </section>
      ))}
    </div>
  );
}
