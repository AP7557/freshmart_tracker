'use client';

import { useEffect, useState } from 'react';
import { useGlobalData } from '../../GlobalDataProvider';
import { ComboBox } from '@/components/shared/combobox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Store } from 'lucide-react';
import { UserCard } from '@/components/stats/user-time-log/user-card';
import { getTimeLogsForWeek } from '@/lib/api/userTimeLog';
import { buildEmployeeWeeks } from '@/components/stats/user-time-log/pair-logs';
import { UserWeek } from '@/types/type';
import {
  addWeeklyPayoutOrAdditionalCash,
  getOrCreateWeekEntry,
} from '@/lib/api/register';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCurrentWeekDateUTC } from '@/lib/utils/week-calculation';

export default function UserLogPage() {
  const { storeOptions } = useGlobalData();
  const { weekStart, weekEnd } = getCurrentWeekDateUTC();
  const [selectedStore, setSelectedStore] = useState<string>('');
  const [users, setUsers] = useState<Record<string, UserWeek>>({});
  const [payroll, setPayroll] = useState<Record<string, number>>({});
  const [weekId, setWeekId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handlePayChange = (name: string, amount: number) => {
    setPayroll((prev) => ({
      ...prev,
      [name]: amount,
    }));
  };

  const handleTransferPayroll = async () => {
    if (!weekId || submitting) return;

    try {
      setSubmitting(true);

      const payoutOrAdditionalCashInserts = Object.entries(payroll).map(
        ([name, amount]) => ({
          week_id: weekId,
          name,
          amount,
        }),
      );

      await addWeeklyPayoutOrAdditionalCash(
        payoutOrAdditionalCashInserts,
        'insert_weekly_payouts',
      );

      setSuccess(true);

      setTimeout(() => {
        router.push('/portal/stats/register');
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    async function fetchLogs() {
      if (!selectedStore) return;

      const storeId = storeOptions.find((s) => s.name === selectedStore)?.id;
      if (!storeId) return;
      setLoading(true);

      const rawLogs = await getTimeLogsForWeek(storeId);

      const grouped = buildEmployeeWeeks(rawLogs);

      const data = await getOrCreateWeekEntry(storeId);

      if (data?.length) {
        setWeekId(data[0].week_id);
      }
      setUsers(grouped);

      setLoading(false);
    }

    fetchLogs();
  }, [selectedStore, storeOptions]);

  return (
    <div className='max-w-5xl mx-auto p-6 space-y-6'>
      {/* Page Header */}
      <div className='space-y-1'>
        <h1 className='text-2xl font-semibold tracking-tight text-primary'>
          Employee Time Log
        </h1>

        {selectedStore ? (
          <p className='text-sm text-muted-foreground'>
            Viewing time logs for{' '}
            <span className='font-medium text-primary underline decoration-primary underline-offset-2'>
              {selectedStore}
            </span>{' '}
            for the week of{' '}
            <span className='font-medium text-primary underline decoration-primary underline-offset-2'>
              {weekStart}
            </span>{' '}
            to{' '}
            <span className='font-medium text-primary underline decoration-primary underline-offset-2'>
              {weekEnd}
            </span>
          </p>
        ) : (
          <p className='text-sm text-muted-foreground'>
            Select a store to view employee time logs and transfer payroll
          </p>
        )}
      </div>

      <div className='border-b pb-4' />

      {/* Store Picker */}
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
            setValue={setSelectedStore}
          />
        </CardContent>
      </Card>

      {/* User Cards */}
      {selectedStore && (
        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6'>
          {Object.values(users).map((user: UserWeek) => (
            <UserCard
              key={user.finger_id}
              user={user}
              onPayChange={handlePayChange}
            />
          ))}
        </div>
      )}

      {selectedStore && (
        <div className='flex justify-end pt-8'>
          {success ? (
            <div className='flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-4 py-2 text-green-700'>
              <CheckCircle className='h-5 w-5' />
              <span className='font-medium'>
                Payroll transferred successfully
              </span>
            </div>
          ) : (
            <Button
              onClick={handleTransferPayroll}
              disabled={submitting || loading || !weekId}
            >
              {submitting ? 'Transferring…' : 'Transfer Payroll'}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
