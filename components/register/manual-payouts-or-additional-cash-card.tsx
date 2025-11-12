import React, { Dispatch, SetStateAction } from 'react';
import { FormField, FormItem, FormMessage } from '../ui/form';
import { LabelWithIcon } from '../shared/label-with-icon';
import { Input } from '../ui/input';
import { DollarSign, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { RegisterForm } from '@/app/portal/stats/register/page';
import {
  UseFieldArrayRemove,
  UseFieldArrayUpdate,
  UseFormReturn,
} from 'react-hook-form';
import {
  addWeeklyPayoutOrAdditionalCash,
  deleteWeeklyPayoutOrAdditionalCash,
  updateWeeklyPayoutOrAdditionalCash,
} from '@/lib/api/register';

export default function ManualPayoutsOrAdditionalCashCard({
  form,
  removePayoutOrAdditionalCash,
  updatePayoutOrAdditionalCash,
  index,
  setLoading,
  weekId,
  loading,
  name,
  title,
  dbName,
  rpcName,
}: {
  form: UseFormReturn<RegisterForm>;
  removePayoutOrAdditionalCash: UseFieldArrayRemove;
  updatePayoutOrAdditionalCash: UseFieldArrayUpdate<RegisterForm>;
  index: number;
  setLoading: Dispatch<SetStateAction<boolean>>;
  weekId: number;
  loading: boolean;
  name: 'payouts' | 'additionalCash';
  title: string;
  dbName: string;
  rpcName: string;
}) {
  const dirty = form.formState.dirtyFields[name]?.[index];
  const isNew = !form.getValues(`${name}.${index}.id`);
  const hasChanges = dirty && Object.values(dirty).some((v) => v);

  const handleSavePayoutOrAdditionalCash = async (
    values: RegisterForm,
    index: number
  ) => {
    const currentValues = values[name][index];

    setLoading(true);
    if (currentValues.id) {
      await updateWeeklyPayoutOrAdditionalCash(
        {
          ...currentValues,
        },
        dbName
      );
    } else {
      const data = await addWeeklyPayoutOrAdditionalCash(
        {
          ...currentValues,
          weekId,
        },
        rpcName
      );

      if (data) {
        updatePayoutOrAdditionalCash(index, {
          ...currentValues,
          id: data,
        });
      }
    }
    setLoading(false);
  };

  const handleDeletePayoutOrAdditionalCash = async (index: number) => {
    const currentValues = form.getValues(`${name}.${index}`);
    setLoading(true);
    if (currentValues.id) {
      await deleteWeeklyPayoutOrAdditionalCash(currentValues.id, dbName);
    }
    removePayoutOrAdditionalCash(index);
    setLoading(false);
  };

  return (
    <div className='p-4'>
      <div className='space-y-4'>
        <FormField
          control={form.control}
          name={`${name}.${index}.name`}
          render={({ field }) => (
            <FormItem className='space-y-2'>
              <LabelWithIcon icon={DollarSign}>Name</LabelWithIcon>
              <Input
                {...field}
                placeholder={`Enter ${title.toLowerCase()} name`}
                className='focus:ring-2 focus:ring-primary focus:border-primary'
              />
              <FormMessage className='text-xs' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`${name}.${index}.amount`}
          render={({ field }) => (
            <FormItem className='space-y-2'>
              <LabelWithIcon icon={DollarSign}>Amount</LabelWithIcon>
              <Input
                {...field}
                type='number'
                step='0.01'
                placeholder='0.00'
                className='focus:ring-2 focus:ring-primary focus:border-primary '
                onChange={(e) => {
                  const val = e.target.value;
                  field.onChange(val === '' ? '' : Number(val));
                }}
                onWheel={(e) => e.currentTarget.blur()}
              />
              <FormMessage className='text-xs' />
            </FormItem>
          )}
        />
        <div className='flex items-end gap-2'>
          <Button
            type='button'
            onClick={form.handleSubmit((values: RegisterForm) =>
              handleSavePayoutOrAdditionalCash(values, index)
            )}
            disabled={loading || (!hasChanges && !isNew)}
            className='flex-1 bg-primary hover:bg-primary/90 focus:ring-2 focus:ring-primary text-primary-foreground'
          >
            {form.getValues(`${name}.${index}.id`) ? 'Update' : 'Add'}
          </Button>
          <Button
            type='button'
            onClick={() => handleDeletePayoutOrAdditionalCash(index)}
            size='sm'
            variant='destructive'
            disabled={loading}
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  );
}
