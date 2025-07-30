'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getDashboardData } from '@/db/db-calls';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Wallet, Banknote, DollarSign, Store } from 'lucide-react';

export default function DashboardPage() {
  const [data, setData] = useState<
    {
      id: number;
      name: string;
      totalInvoiceLeft: number;
      totalPostedLeft: number;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const dashboardData = await getDashboardData();
      if (dashboardData) setData(dashboardData);

      setLoading(false);
    })();
  }, []);

  return (
    <div className='p-6 space-y-6'>
      <h1 className='text-3xl font-bold text-primary tracking-tight mb-4 flex items-center gap-2'>
        <Store className='w-5 h-5 flex-shrink-0 text-primary' /> Store Dashboard
      </h1>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Skeleton
                key={i}
                className='h-36 w-full rounded-xl'
              />
            ))
          : data.map((store) => (
              <Link
                key={store.id}
                href={`/vendor/dashboard/${store.id}`}
              >
                <Card className='transition-transform hover:scale-[1.015] hover:shadow-md hover:border-primary'>
                  <CardHeader className='pb-2 flex items-center gap-2'>
                    <Store className='w-5 h-5 flex-shrink-0 text-primary' />
                    <CardTitle className='text-lg font-semibold truncate text-primary'>
                      {store.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-2'>
                    <div className='flex justify-between items-center flex-col'>
                      <div className='flex items-center gap-2 text-muted-foreground'>
                        <Wallet className='w-5 h-5 flex-shrink-0 text-primary' />
                        <span>Outstanding Payout</span>
                      </div>
                      <span className='font-semibold text-primary flex items-center gap-1'>
                        <DollarSign className='w-5 h-5 flex-shrink-0' />
                        {store.totalInvoiceLeft
                          .toFixed(2)
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      </span>
                    </div>

                    <div className='flex justify-between items-center flex-col'>
                      <div className='flex items-center gap-2 text-muted-foreground'>
                        <Banknote className='w-5 h-5 flex-shrink-0 text-primary' />
                        <span>Bank Withdrawal</span>
                      </div>
                      <span className='font-semibold text-primary flex items-center gap-1'>
                        <DollarSign className='w-5 h-5 flex-shrink-0' />
                        {store.totalPostedLeft
                          .toFixed(2)
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
      </div>
    </div>
  );
}
