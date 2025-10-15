'use client';
import { format } from 'date-fns';
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

export function DatePicker({
  placeholder,
  selectedValue,
  setValue,
  shouldBeDisabled = true,
}: {
  placeholder: string;
  selectedValue: Date;
  setValue: (value: Date) => void;
  shouldBeDisabled?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger
        asChild
        className='w-full'
      >
        <Button
          variant='secondary'
          className={cn(
            'pl-3 text-left font-normal text-base',
            !selectedValue && 'text-muted-foreground'
          )}
        >
          {selectedValue ? (
            format(selectedValue, 'PPP')
          ) : (
            <span>{placeholder}</span>
          )}
          <CalendarIcon className='ml-auto h-4 w-4 text-primary opacity-70' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='w-auto p-0'
        align='start'
      >
        <Calendar
          mode='single'
          selected={selectedValue}
          onSelect={(date) => {
            setValue(date as Date);
            setOpen(false);
          }}
          disabled={(date) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Strip time
            return shouldBeDisabled && date < today;
          }}
          captionLayout='dropdown'
        />
      </PopoverContent>
    </Popover>
  );
}
