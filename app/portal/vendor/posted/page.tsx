'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ComboBox } from '@/components/shared/combobox';
import SwipeList from '@/components/vendor/swipe-card';
import { Input } from '@/components/ui/input';
import { PostedPayoutsType } from '@/types/type';
import { Banknote, BanknoteArrowDown, Store } from 'lucide-react';
import { Label } from '@/components/ui/label';
import DesktopTable from '@/components/shared/desktop-table';
import { useRouter } from 'next/navigation';
import { useGlobalData } from '@/app/portal/GlobalDataProvider';
import { getPayoutsToPostCached, updatePayout } from '@/lib/api/payouts';

export default function PostedPage() {
  const router = useRouter();
  const { storeOptions } = useGlobalData();

  const [selectedStore, setSelectedStore] = useState<string>('');
  const [payouts, setPayouts] = useState<PostedPayoutsType[]>([]);
  const [loading, setLoading] = useState(false);
  const [bankBalance, setBankBalance] = useState<number | ''>('');

  useEffect(() => {
    (async () => {
      if (selectedStore) {
        setLoading(true);
        const storeId = storeOptions.find((s) => s.name === selectedStore)?.id;
        if (storeId) {
          const payoutsToPost = await getPayoutsToPostCached(storeId);

          if (payoutsToPost?.payoutData) {
            setPayouts(payoutsToPost.payoutData);
          }
        }

        setLoading(false);
      }
    })();
  }, [selectedStore, storeOptions]);

  const markCheckDeposited = async (payoutId: number) => {
    const storeId = storeOptions.find((s) => s.name === selectedStore)?.id || 0;

    await updatePayout(payoutId, storeId)
      .then(() => {
        router.refresh(); // refreshes server-side cached data
        setPayouts((prev) => prev.filter((p) => p.id !== payoutId));
      })
      .catch((error) => {
        console.error('Error at updating payout', error);
      });
  };

  const totalPending = payouts.reduce((sum, p) => sum + p.amount, 0);
  const remainingBalance =
    typeof bankBalance === 'number' ? bankBalance - totalPending : 0;

  return (
    <div className='max-w-5xl mx-auto p-6 space-y-6'>
      {/* Store Selector */}
      <Card>
        <CardHeader className='flex items-center gap-2 text-primary'>
          <Store className='w-5 h-5 flex-shrink-0' />
          <CardTitle className='text-lg font-semibold'>Select Store</CardTitle>
        </CardHeader>
        <CardContent>
          <ComboBox
            options={storeOptions}
            selectedValue={selectedStore}
            placeholder='Select a store'
            setValue={(value) => setSelectedStore(value)}
          />
        </CardContent>
      </Card>

      {/* Bank Balance & Summary */}
      {selectedStore && (
        <Card className='bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg shadow-md mb-6'>
          <CardContent className='space-y-4'>
            <div className='flex flex-col md:flex-row md:items-center md:gap-6'>
              <div className='flex-1'>
                <Label className='font-semibold text-base mb-2 flex items-center gap-2 text-primary'>
                  <Banknote className='w-5 h-5 flex-shrink-0' />
                  Bank Balance
                </Label>
                <Input
                  type='number'
                  className='text-base focus:ring-2 focus:ring-primary'
                  placeholder='Enter balance'
                  value={bankBalance || ''}
                  onChange={(e) =>
                    setBankBalance(
                      e.target.value === '' ? '' : Number(e.target.value)
                    )
                  }
                  min={0}
                  onWheel={(e) => e.currentTarget.blur()} // prevents scroll from changing number
                />
              </div>
              <div className='flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 md:mt-0'>
                <div className='bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-md p-4 shadow-sm text-center'>
                  <p className='text-sm font-medium text-[hsl(var(--muted-foreground))]'>
                    Total Pending Payouts
                  </p>
                  <p className='text-lg font-semibold text-red-500'>
                    $
                    {totalPending
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </p>
                </div>
                <div className='bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-md p-4 shadow-sm text-center'>
                  <p className='text-sm font-medium text-[hsl(var(--muted-foreground))]'>
                    Remaining Balance
                  </p>
                  <p className='text-lg font-semibold text-[hsl(var(--primary))]'>
                    {bankBalance
                      ? `$${remainingBalance
                          .toFixed(2)
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                      : '—'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payout Table */}
      {selectedStore && (
        <Card>
          <CardHeader className='flex items-center gap-2 text-primary'>
            <BanknoteArrowDown className='w-5 h-5 flex-shrink-0' />
            <CardTitle className='text-lg font-semibold'>
              Pending Bank Withdrawal
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading && <p className='text-muted-foreground'>Loading...</p>}{' '}
            {payouts.length === 0 && (
              <p className='text-muted-foreground'>No pending payouts.</p>
            )}
            <DesktopTable
              payouts={payouts}
              isActionable
              markCheckDeposited={markCheckDeposited}
            />
            <div className='space-y-4 md:hidden'>
              {payouts.map((payout) => (
                <SwipeList
                  key={payout.id}
                  payout={payout}
                  markCheckDeposited={markCheckDeposited}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
