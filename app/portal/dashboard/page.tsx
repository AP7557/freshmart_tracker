import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, Banknote, DollarSign, Store } from 'lucide-react';
import { getDashboardData } from '@/lib/api/dashboard';

export default async function DashboardPage() {
  const dashboardData = await getDashboardData();

  return (
    <div className='p-6 space-y-6'>
      <h1 className='text-3xl font-bold text-primary tracking-tight mb-4 flex items-center gap-2'>
        <Store className='w-5 h-5 flex-shrink-0 text-primary' /> Store Dashboard
      </h1>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {dashboardData.length === 0 ? (
          <div className='text-muted-foreground col-span-full text-center'>
            No store data available.
          </div>
        ) : (
          dashboardData.map(
            (store: {
              store_id: number;
              store_name: string;
              total_invoice_left: number;
              total_posted_left: number;
            }) => (
              <Link
                key={store.store_id}
                href={`/portal/dashboard/${store.store_id}`}
              >
                <Card className='transition-transform hover:scale-[1.015] hover:shadow-md hover:border-primary'>
                  <CardHeader className='pb-2 flex items-center gap-2'>
                    <Store className='w-5 h-5 flex-shrink-0 text-primary' />
                    <CardTitle className='text-lg font-semibold truncate text-primary'>
                      {store.store_name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-2'>
                    <div className='flex flex-col items-center'>
                      <div className='flex items-center gap-2 text-muted-foreground'>
                        <Wallet className='w-5 h-5 flex-shrink-0 text-primary' />
                        <span>Outstanding Payout</span>
                      </div>
                      <span className='font-semibold text-primary flex items-center gap-1'>
                        <DollarSign className='w-5 h-5 flex-shrink-0' />
                        {store.total_invoice_left
                          .toFixed(2)
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      </span>
                    </div>

                    <div className='flex flex-col items-center'>
                      <div className='flex items-center gap-2 text-muted-foreground'>
                        <Banknote className='w-5 h-5 flex-shrink-0 text-primary' />
                        <span>Bank Withdrawal</span>
                      </div>
                      <span className='font-semibold text-primary flex items-center gap-1'>
                        <DollarSign className='w-5 h-5 flex-shrink-0' />
                        {store.total_posted_left
                          .toFixed(2)
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          )
        )}
      </div>
    </div>
  );
}
