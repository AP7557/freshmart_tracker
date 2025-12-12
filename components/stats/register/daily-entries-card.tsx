import React, { Dispatch, SetStateAction } from 'react';
import { FormField, FormItem, FormMessage } from '../../ui/form';
import { LabelWithIcon } from '../../shared/label-with-icon';
import { DatePicker } from '../../shared/date-picker';
import { Input } from '../../ui/input';
import { Calendar, DollarSign, Trash2 } from 'lucide-react';
import { Button } from '../../ui/button';
import { RegisterForm } from '@/app/portal/stats/register/page';
import { UseFieldArrayRemove, UseFormReturn } from 'react-hook-form';
import {
  addDailyEntry,
  deleteDailyEntry,
  updateDailyEntry,
} from '@/lib/api/register';
import { formatMoney } from '@/lib/utils/format-number';
import { getCurrentWeekDateUTC } from '@/lib/utils/week-calculation';

const isDateDisabled = (date: Date) => {
  const { weekStart, weekEnd } = getCurrentWeekDateUTC();
  const dString = date.toISOString().slice(0, 10);
  return dString < weekStart || dString > weekEnd;
};

export default function DailyEntriesCard({
  form,
  removeEntry,
  index,
  setLoading,
  weekId,
  loading,
  cashValue,
}: {
  form: UseFormReturn<RegisterForm>;
  removeEntry: UseFieldArrayRemove;
  index: number;
  setLoading: Dispatch<SetStateAction<boolean>>;
  weekId: number;
  loading: boolean;
  cashValue: number;
}) {
  const dirty = form.formState.dirtyFields.entries?.[index];
  const isNew = !form.getValues(`entries.${index}.entry_id`);
  const hasChanges = dirty && Object.values(dirty).some((v) => v);

  const handleSaveEntry = async (values: RegisterForm, index: number) => {
    const currentEntryValues = values.entries[index];
    setLoading(true);

    let savedData;

    // Update case
    if (currentEntryValues.entry_id) {
      const data = await updateDailyEntry({ ...currentEntryValues });
      savedData = data?.[0];
    }
    // Add case
    else {
      const data = await addDailyEntry({
        ...currentEntryValues,
        weekId,
      });
      savedData = data?.[0];
    }

    if (!savedData) {
      setLoading(false);
      return;
    }

    // 1️⃣ Sort all entries
    const sortedEntries = [...values.entries].sort((a, b) =>
      a.entry_date > b.entry_date ? 1 : -1
    );

    // 2️⃣ Find which one matches this entry
    const updatedIndex = sortedEntries.findIndex((e) => {
      if (currentEntryValues.entry_id) {
        return e.entry_id === currentEntryValues.entry_id;
      }
      return (
        e.entry_date === currentEntryValues.entry_date && !e.entry_id // the new entry with no ID
      );
    });

    // 3️⃣ Apply updated data to the sorted entry
    sortedEntries[updatedIndex] = {
      ...currentEntryValues,
      entry_id: savedData.entry_id,
      cash: savedData.calculated_cash ?? savedData.cash,
    };

    // 4️⃣ Save sorted + updated entries
    form.setValue('entries', sortedEntries);

    // 5️⃣ Mark fields as clean
    form.trigger(`entries.${updatedIndex}`);

    setLoading(false);
  };

  const handleDeleteEntry = async (index: number) => {
    const currentEntryValues = form.getValues(`entries.${index}`);
    setLoading(true);
    if (currentEntryValues.entry_id) {
      await deleteDailyEntry(currentEntryValues.entry_id);
    }
    removeEntry(index);
    setLoading(false);
  };

  return (
    <div className='p-4 sm:p-5 lg:p-6'>
      <div className='space-y-4 lg:space-y-0 flex flex-col lg:flex-row lg:gap-4 lg:items-end'>
        <FormField
          control={form.control}
          name={`entries.${index}.entry_date`}
          render={({ field }) => (
            <FormItem className='space-y-2 lg:col-span-2'>
              <LabelWithIcon icon={Calendar}>Date</LabelWithIcon>
              <DatePicker
                placeholder='Select date'
                selectedValue={field.value}
                setValue={(value: Date) => field.onChange(value)}
                shouldBeDisabled={isDateDisabled}
              />
              <FormMessage className='text-red-500 mt-1 text-sm' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`entries.${index}.business`}
          render={({ field }) => (
            <FormItem className='space-y-2 lg:col-span-2'>
              <LabelWithIcon icon={DollarSign}>Business</LabelWithIcon>
              <Input
                {...field}
                type='number'
                placeholder='0.00'
                className='focus:ring-2 focus:ring-primary focus:border-primary'
                step='0.01'
                onChange={(e) => {
                  const val = e.target.value;
                  field.onChange(val === '' ? '' : Number(val));
                }}
                onWheel={(e) => e.currentTarget.blur()}
              />
              <FormMessage className='text-red-500 mt-1 text-sm' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`entries.${index}.payout`}
          render={({ field }) => (
            <FormItem className='space-y-2 lg:col-span-2'>
              <LabelWithIcon icon={DollarSign}>Payout</LabelWithIcon>
              <Input
                {...field}
                type='number'
                placeholder='0.00'
                className='focus:ring-2 focus:ring-primary focus:border-primary'
                step='0.01'
                onChange={(e) => {
                  const val = e.target.value;
                  field.onChange(val === '' ? '' : Number(val));
                }}
                onWheel={(e) => e.currentTarget.blur()}
              />
              <FormMessage className='text-red-500 mt-1 text-sm' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`entries.${index}.card`}
          render={({ field }) => (
            <FormItem className='space-y-2 lg:col-span-2'>
              <LabelWithIcon icon={DollarSign}>Card</LabelWithIcon>
              <Input
                {...field}
                type='number'
                placeholder='0.00'
                className='focus:ring-2 focus:ring-primary focus:border-primary'
                step='0.01'
                onChange={(e) => {
                  const val = e.target.value;
                  field.onChange(val === '' ? '' : Number(val));
                }}
                onWheel={(e) => e.currentTarget.blur()}
              />
              <FormMessage className='text-red-500 mt-1 text-sm' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`entries.${index}.over_short`}
          render={({ field }) => (
            <FormItem className='space-y-2 lg:col-span-2'>
              <LabelWithIcon icon={DollarSign}>Over/Short</LabelWithIcon>
              <Input
                {...field}
                type='number'
                placeholder='0.00'
                className='focus:ring-2 focus:ring-primary focus:border-primary'
                step='0.01'
                onChange={(e) => {
                  const val = e.target.value;
                  field.onChange(val === '' ? '' : Number(val));
                }}
                onWheel={(e) => e.currentTarget.blur()}
              />
              <FormMessage className='text-red-500 mt-1 text-sm' />
            </FormItem>
          )}
        />
        <div className='flex items-end gap-2 lg:col-span-2'>
          <Button
            onClick={form.handleSubmit((values: RegisterForm) =>
              handleSaveEntry(values, index)
            )}
            type='submit'
            disabled={loading || (!hasChanges && !isNew)}
            className='flex-1 lg:flex-initial bg-primary hover:bg-primary/90 focus:ring-2 focus:ring-primary text-primary-foreground'
          >
            {form.getValues(`entries.${index}.entry_id`) ? 'Update' : 'Add'}
          </Button>
          <Button
            type='button'
            onClick={() => handleDeleteEntry(index)}
            size='sm'
            variant='destructive'
            disabled={loading}
          >
            <Trash2 className='w-5 h-5' />
          </Button>
        </div>
      </div>
      <div className='mt-4 pt-4 border-t border-border/50'>
        <div className='flex items-center justify-end gap-3'>
          <span className='text-sm font-medium text-muted-foreground'>
            Calculated Cash:
          </span>
          <span className='text-base font-semibold text-amber-400'>
            ${formatMoney(cashValue)}
          </span>
        </div>
      </div>
    </div>
  );
}
