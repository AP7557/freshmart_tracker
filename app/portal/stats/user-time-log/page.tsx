'use client';

import { useEffect, useState } from 'react';
import { useGlobalData } from '../../GlobalDataProvider';
import { ComboBox } from '@/components/shared/combobox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Store } from 'lucide-react';
import { UserCard } from '@/components/stats/user-time-log/user-card';
import { getDeviceStatus, getTimeLogsForWeek } from '@/lib/api/userTimeLog';
import { buildEmployeeWeeks } from '@/components/stats/user-time-log/pair-logs';
import { DeviceStatus, UserWeek } from '@/types/type';
import {
  addWeeklyPayoutOrAdditionalCash,
  getOrCreateWeekEntry,
} from '@/lib/api/register';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCurrentWeekDateUTC } from '@/lib/utils/week-calculation';
import { formatToEST } from '@/lib/utils/date-format';

export default function UserLogPage() {
  const router = useRouter();
  const { storeOptions } = useGlobalData();
  const { weekStart, weekEnd } = getCurrentWeekDateUTC();

  const [selectedStore, setSelectedStore] = useState<string>('');
  const [users, setUsers] = useState<Record<string, UserWeek>>({});
  const [payroll, setPayroll] = useState<Record<string, number>>({});
  const [weekId, setWeekId] = useState<number | null>(null);
  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus | null>(null);

  const [loading, setLoading] = useState(false);
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
      setDeviceStatus(null); // reset when changing stores

      try {
        const rawLogs = await getTimeLogsForWeek(storeId);
        const grouped = buildEmployeeWeeks(rawLogs);
        const data = await getOrCreateWeekEntry(storeId);
        const status = await getDeviceStatus(storeId);

        if (status) {
          setDeviceStatus(status);
        }

        if (data?.length) {
          setWeekId(data[0].week_id);
        }

        setUsers(grouped);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchLogs();
  }, [selectedStore, storeOptions]);

  const isDeviceBlockingPayroll =
    deviceStatus &&
    (deviceStatus.status === 'offline' ||
      (deviceStatus.pending_count ?? 0) > 0);

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

        {selectedStore && deviceStatus && (
          <CardContent className='flex items-center justify-between p-4'>
            <div className='flex flex-col gap-1'>
              <div className='flex items-center gap-3'>
                <div
                  className={`h-3 w-3 rounded-full ${
                    deviceStatus.status === 'online'
                      ? 'bg-green-500'
                      : 'bg-red-500'
                  }`}
                />
                <span className='font-medium'>
                  {deviceStatus.status === 'online'
                    ? 'Device Online'
                    : 'Device Offline'}
                </span>
              </div>

              {deviceStatus.last_seen &&
                (() => {
                  const formatted = formatToEST(deviceStatus.last_seen);
                  if (!formatted) return null;

                  return (
                    <span className='text-xs text-muted-foreground'>
                      {deviceStatus.status === 'online'
                        ? 'Last sync: '
                        : 'Last seen: '}
                      {formatted.relative}
                      <span className='ml-1 opacity-70'>
                        ({formatted.full})
                      </span>
                    </span>
                  );
                })()}
            </div>

            {(deviceStatus.status === 'offline' ||
              (deviceStatus.pending_count ?? 0) > 0) && (
              <div className='text-sm text-muted-foreground'>
                Pending Employee Count:{' '}
                <span className='font-semibold text-primary'>
                  {deviceStatus.pending_count ?? 0}
                </span>
              </div>
            )}
          </CardContent>
        )}
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

      {/* Transfer Section */}
      {selectedStore && (
        <div className='flex flex-col items-end pt-8 gap-2'>
          {success ? (
            <div className='flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-4 py-2 text-green-700'>
              <CheckCircle className='h-5 w-5' />
              <span className='font-medium'>
                Payroll transferred successfully
              </span>
            </div>
          ) : (
            <>
              <Button
                onClick={handleTransferPayroll}
                disabled={
                  submitting || loading || !weekId || !!isDeviceBlockingPayroll
                }
              >
                {submitting ? 'Transferring…' : 'Transfer Payroll'}
              </Button>

              {isDeviceBlockingPayroll && (
                <p className='text-sm text-red-500'>
                  Payroll transfer disabled:
                  {deviceStatus?.status === 'offline'
                    ? ' Device is offline.'
                    : ' Pending employees must be synced first.'}
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
