import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { User, Clock, DollarSign } from 'lucide-react';
import { EST_WEEK_DAYS } from './pair-logs';
import { UserWeek } from '@/types/type';

export function UserCard({
  user,
  onPayChange,
}: {
  user: UserWeek;
  onPayChange: (name: string, amount: number) => void;
}) {
  const [rate, setRate] = useState(0);

  const totalHours = user.totalMinutes / 60;
  const totalPay = (totalHours * rate).toFixed(2);

  useEffect(() => {
    const storedRate = localStorage.getItem(`${user.name}-rate`);
    if (storedRate && storedRate != '0') {
      setRate(Number(storedRate));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem(`${user.name}-rate`, String(rate));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rate]);

  useEffect(() => {
    onPayChange(`${user.name} Pay`, Number(totalPay));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPay]);

  return (
    <Card className='flex flex-col justify-between p-5 space-y-4 shadow-sm hover:shadow-md transition'>
      <div className='flex items-center gap-3 border-b pb-3'>
        <User className='w-5 h-5 text-primary' />
        <h2 className='text-lg font-semibold'>{user.name}</h2>
      </div>

      <div className='space-y-4 text-sm'>
        {Object.values(user.days).map((day, i) =>
          day.shifts.length ? (
            <div key={i} className='rounded-md bg-muted/40 p-3 space-y-1'>
              <div className='flex items-center justify-between text-xs font-medium text-muted-foreground'>
                <span>
                  {EST_WEEK_DAYS[i]} • {day.date}
                </span>
              </div>

              {day.shifts.map((shift, idx) => (
                <div
                  key={idx}
                  className='flex items-center justify-between text-sm'
                >
                  <div className='flex items-center gap-2'>
                    <Clock className='w-4 h-4 text-blue-500' />
                    <span>
                      {shift.in ?? '-'} → {shift.out ?? '—'}
                    </span>
                  </div>

                  {shift.minutes && (
                    <span className='font-medium text-blue-600'>
                      {(shift.minutes / 60).toFixed(2)}h
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : null,
        )}
      </div>

      <div className='mt-4 border-t pt-4 space-y-3'>
        <div className='flex items-center justify-between text-sm'>
          <div className='flex items-center gap-2 font-medium'>
            <Clock className='w-4 h-4 text-blue-600' />
            <span>Total</span>
          </div>

          <span className='font-semibold'>{totalHours.toFixed(2)} hrs</span>
        </div>

        <div className='flex items-center gap-3'>
          <Input
            type='number'
            placeholder='$/hr'
            className='w-24'
            value={rate !== 0 ? rate : ''}
            onChange={(e) => setRate(Number(e.target.value))}
          />

          <div className='flex items-center gap-2 font-semibold text-green-600'>
            <DollarSign className='w-4 h-4' />
            {totalPay}
          </div>
        </div>
      </div>
    </Card>
  );
}
