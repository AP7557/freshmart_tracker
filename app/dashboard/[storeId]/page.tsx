import { getStorePayoutDetails } from '@/lib/api/dashboard';
import StoreDetailPageClient from './pageClient';

export default async function StoreDetailPage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const storeId = (await params).storeId; // ✅ await it
  const details = await getStorePayoutDetails(Number(storeId));

  return <StoreDetailPageClient initialDetails={details} />;
}
