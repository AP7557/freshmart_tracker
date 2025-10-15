'use client';

import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export function MonthYearPicker({
    selectedValue,
    setValue,
}: {
    selectedValue: Date;
    setValue: (value: Date) => void;
}) {
    const [open, setOpen] = useState(false);

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
                    {selectedValue ? format(selectedValue, 'MMMM yyyy') : 'Select month and year'}
                    <CalendarIcon className='ml-auto h-4 w-4 text-primary opacity-70' />
                </Button>
            </PopoverTrigger>

            <PopoverContent className='w-auto p-0' align='start'>
                <Calendar
                    mode="single"
                    selected={selectedValue}
                    month={selectedValue} // set the current month view
                    captionLayout="dropdown"
                    onMonthChange={(monthDate) => {
                        const newDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
                        setValue(newDate);
                        setOpen(false);
                    }}
                    styles={{
                        month_grid: { display: 'none' } // remove the dot, use the key as in DayPicker
                    }}
                />
            </PopoverContent>
        </Popover>
    );
}
