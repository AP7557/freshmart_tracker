'use client';
import { addMonths, subYears } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useState } from 'react';
import { convertEstDateToUtc, formatUtcAsEst } from '@/lib/utils/date-format';

export function DatePicker({
  placeholder,
  selectedValue,
  setValue,
  shouldBeDisabled,
  styles,
}: {
  placeholder: string;
  selectedValue: Date;
  setValue: (value: Date) => void;
  shouldBeDisabled?: (date: Date) => boolean;
  formatType?: string;
  styles?: object;
}) {
  const [open, setOpen] = useState(false);
  const now = new Date();
  const startMonth3YrFromNow = subYears(now, 5);
  const endMonth5MtFromNow = addMonths(now, 5);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className='w-full'>
        <Button
          variant='secondary'
          className={cn(
            'pl-3 text-left font-normal text-base',
            !selectedValue && 'text-muted-foreground'
          )}
        >
          {selectedValue ? (
            formatUtcAsEst(selectedValue)
          ) : (
            <span>{placeholder}</span>
          )}
          <CalendarIcon className='ml-auto h-4 w-4 text-primary opacity-70' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <Calendar
          mode='single'
          selected={selectedValue}
          month={selectedValue} // set the current month view
          onSelect={(date) => {
            const utcDate = convertEstDateToUtc(date as Date);
            setValue(utcDate); // form now stores UTC
            setOpen(false);
          }}
          onMonthChange={(monthDate) => {
            const newDate = new Date(
              monthDate.getFullYear(),
              monthDate.getMonth(),
              1
            );
            setValue(newDate);
          }}
          startMonth={startMonth3YrFromNow}
          endMonth={endMonth5MtFromNow}
          disabled={shouldBeDisabled}
          captionLayout='dropdown'
          styles={styles}
        />
      </PopoverContent>
    </Popover>
  );
}
