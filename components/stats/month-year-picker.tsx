import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

export function MonthYearPicker({
    date,
    setDate,
}: {
    date: Date | undefined;
    setDate: (date: Date) => void;
}) {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'MMMM yyyy') : 'Select month and year'}
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="p-3">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => {
                        if (newDate) {
                            setDate(new Date(newDate.getFullYear(), newDate.getMonth(), 1));
                            setOpen(false);
                        }
                    }}
                    captionLayout="dropdown"
                    styles={{
                        month_grid: { display: 'none' } // remove the dot, use the key as in DayPicker
                    }} />
            </PopoverContent>
        </Popover>
    );
}
