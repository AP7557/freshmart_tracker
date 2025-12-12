import {
  getDepartmentStatsForHeatMap,
  getRegisterWeeklyOverview,
  getStorePayoutDetails,
} from '@/lib/api/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { StorePayoutTable } from '@/components/dashboard/store-all-payout-table';
import { AllPayoutsType, FuturePaymentsType } from '@/types/type';
import { Check, Calendar, Building, Activity } from 'lucide-react';
import { DepartmentComparisonChart } from '@/components/dashboard/department-stats-comparison-chart';
import { formatMoney } from '@/lib/utils/format-number';
import { formatUtcAsEstDate } from '@/lib/utils/date-format';
import RegisterOverviewChart from '@/components/dashboard/register-chart';
import Link from 'next/link';

export default async function StoreDetailPage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const storeId = (await params).storeId; // ✅ await it
  const initialDetails: {
    store_name: string;
    all_payouts: AllPayoutsType[];
    company_totals: Record<string, number>;
    future_payments: FuturePaymentsType;
  } | null = await getStorePayoutDetails(Number(storeId));

  const departmentStats = await getDepartmentStatsForHeatMap(Number(storeId));
  const registerStats = await getRegisterWeeklyOverview(Number(storeId));

  if (!initialDetails || !departmentStats || !registerStats)
    return <Skeleton className='h-32 w-full rounded-xl animate-pulse' />;

  return (
    <div className='max-w-5xl mx-auto p-6 space-y-6'>
      <h1 className='text-3xl font-bold text-primary mb-6 text-center md:text-left'>
        {initialDetails.store_name} - Store Details
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
            {Object.entries(initialDetails.company_totals).map(
              ([company, amount]) => (
                <div
                  key={company}
                  className='flex justify-between items-center bg-muted rounded-md px-4 py-3 shadow-sm'
                >
                  <div className='flex items-center gap-2 text-sm md:text-base font-medium text-foreground'>
                    <Building className='w-5 h-5 flex-shrink-0 text-primary' />
                    <span>{company}</span>
                  </div>
                  <span className='font-semibold text-primary'>
                    ${formatMoney(amount)}
                  </span>
                </div>
              )
            )}
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
            {initialDetails.future_payments.map((payout, idx) => (
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
                        : `ACH: ${formatUtcAsEstDate(
                            payout.date_to_withdraw!
                          )}`}
                    </span>
                  </div>
                </div>
                <span className='font-semibold text-primary'>
                  ${formatMoney(payout.amount)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className='text-lg font-semibold text-primary'>
            Register
          </CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col items-center justify-center text-sm text-foreground'>
          {registerStats.length !== 0 ? (
            <RegisterOverviewChart registerStats={registerStats} />
          ) : (
            <div className='flex flex-col items-center justify-center space-y-2'>
              <Activity className='h-12 w-12 text-muted-foreground' />
              <span className='text-center text-foreground'>
                Not enough data. Please add stats for at least one week at
              </span>
              <Link href='/portal/stats/register'>Register Page</Link>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className='text-lg font-semibold text-primary'>
            Department Trend
          </CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col items-center justify-center text-sm text-foreground'>
          {departmentStats.length !== 0 ? (
            <DepartmentComparisonChart departmentStats={departmentStats} />
          ) : (
            <div className='flex flex-col items-center justify-center space-y-2'>
              <Activity className='h-12 w-12 text-muted-foreground' />
              <span className='text-center text-foreground'>
                Not enough data. Please add stats for at least one month.
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Payouts Table */}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg font-semibold text-primary'>
            All Payouts
          </CardTitle>
        </CardHeader>
        <CardContent className='text-sm text-foreground'>
          <StorePayoutTable payouts={initialDetails.all_payouts} />
        </CardContent>
      </Card>
    </div>
  );
}
