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

export default function UserLogPage() {
  const { storeOptions } = useGlobalData();
  const [selectedStore, setSelectedStore] = useState<string>('');
  const [users, setUsers] = useState<Record<string, UserWeek>>({});

  useEffect(() => {
    async function fetchLogs() {
      if (!selectedStore) return;

      const storeId = storeOptions.find((s) => s.name === selectedStore)?.id;
      if (!storeId) return;

      const rawLogs = await getTimeLogsForWeek(storeId);

      const grouped = buildEmployeeWeeks(rawLogs);
      setUsers(grouped);
    }

    fetchLogs();
  }, [selectedStore, storeOptions]);

  return (
    <div className='max-w-5xl mx-auto p-6 space-y-6'>
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
            <UserCard key={user.finger_id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
}
