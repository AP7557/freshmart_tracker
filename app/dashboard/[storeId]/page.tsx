'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getStorePayoutDetails } from '@/db/db-calls';
import { Skeleton } from '@/components/ui/skeleton';
import { StorePayoutTable } from '@/components/vendor/store-all-payout-table';
import { AllPayoutsType, FuturePaymentsType } from '@/types/type';
import { Check, Calendar, Building } from 'lucide-react';

export default function StoreDetailPage() {
  const { storeId } = useParams();
  const [details, setDetails] = useState<{
    store_name: string;
    allPayouts: AllPayoutsType[];
    companyTotals: Record<string, number>;
    futurePayments: FuturePaymentsType;
  } | null>(null);

  useEffect(() => {
    (async () => {
      const data = await getStorePayoutDetails(Number(storeId));
      if (data) setDetails(data);
    })();
  }, [storeId]);

  if (!details)
    return <Skeleton className='h-32 w-full rounded-xl animate-pulse' />;

  return (
    <div className='max-w-5xl mx-auto p-6 space-y-6'>
      <h1 className='text-3xl font-bold text-primary mb-6 text-center md:text-left'>
        {details.store_name} - Store Details
      </h1>

      {/* Side by side cards on desktop */}
      <div className='flex flex-col md:flex-row md:gap-6'>
        {/* Companies Left to Pay */}
        <Card className='flex-1'>
          <CardHeader>
            <CardTitle className='text-lg font-semibold text-primary'>
              Companies Left to Pay (Invoice)
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-2'>
            {Object.entries(details.companyTotals).map(([company, amount]) => (
              <div
                key={company}
                className='flex justify-between items-center bg-muted rounded-md px-4 py-3 shadow-sm'
              >
                <div className='flex items-center gap-2 text-sm md:text-base font-medium text-foreground'>
                  <Building className='w-5 h-5 flex-shrink-0 text-primary' />
                  <span>{company}</span>
                </div>
                <span className='font-semibold text-primary'>
                  ${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Withdrawal Left */}
        <Card className='flex-1 mt-6 md:mt-0'>
          <CardHeader>
            <CardTitle className='text-lg font-semibold text-primary'>
              Withdrawal Left (Checks / ACH)
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-2'>
            {details.futurePayments.map((payout, idx) => (
              <div
                key={idx}
                className='flex justify-between items-center bg-muted rounded-md px-4 py-3 shadow-sm'
              >
                <div className='flex items-center gap-2'>
                  {payout.check_number ? (
                    <Check className='w-5 h-5 flex-shrink-0 text-primary' />
                  ) : (
                    <Calendar className='w-5 h-5 flex-shrink-0 text-primary' />
                  )}
                  <div className='flex flex-col text-sm md:text-base font-medium text-foreground'>
                    <span>{payout.company_name} -</span>
                    <span>
                      {payout.check_number
                        ? `Check # ${payout.check_number}`
                        : `ACH: ${new Date(
                            payout.date_to_withdraw!
                          ).toLocaleDateString()}`}
                    </span>
                  </div>
                </div>
                <span className='font-semibold text-primary'>
                  $
                  {payout.amount
                    .toFixed(2)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* All Payouts Table */}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg font-semibold text-primary'>
            All Payouts
          </CardTitle>
        </CardHeader>
        <CardContent className='text-sm text-foreground'>
          <StorePayoutTable payouts={details.allPayouts} />
        </CardContent>
      </Card>
    </div>
  );
}
