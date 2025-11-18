import React, { Dispatch, SetStateAction } from 'react';
import { FormField, FormItem, FormMessage } from '../ui/form';
import { LabelWithIcon } from '../shared/label-with-icon';
import { Input } from '../ui/input';
import { Briefcase, DollarSign, Trash2,  } from 'lucide-react';
import { Button } from '../ui/button';
import { RegisterForm } from '@/app/portal/stats/register/page';
import { UseFieldArrayRemove, UseFormReturn } from 'react-hook-form';
import {
  deleteWeeklyPayoutOrAdditionalCash,
  updateWeeklyPayoutOrAdditionalCash,
} from '@/lib/api/register';

export default function ManualPayoutsOrAdditionalCashCard({
  form,
  removePayoutOrAdditionalCash,
  index,
  setLoading,
  loading,
  name,
  title,
  dbName,
}: {
  form: UseFormReturn<RegisterForm>;
  removePayoutOrAdditionalCash: UseFieldArrayRemove;
  index: number;
  setLoading: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  name: 'payouts' | 'additionalCash';
  title: string;
  dbName: string;
}) {
  const dirty = form.formState.dirtyFields[name]?.[index];
  const isNew = !form.getValues(`${name}.${index}.id`);
  const hasChanges = dirty && Object.values(dirty).some((v) => v);

  const handleUpdatePayoutOrAdditionalCash = async (
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
              <LabelWithIcon icon={Briefcase}>Name</LabelWithIcon>
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
        <div className='flex justify-end items-end gap-2'>
          {form.getValues(`${name}.${index}.id`) && (
            <Button
              type='button'
              onClick={form.handleSubmit((values: RegisterForm) =>
                handleUpdatePayoutOrAdditionalCash(values, index)
              )}
              disabled={loading || (!hasChanges && !isNew)}
              className='flex-1 bg-primary hover:bg-primary/90 focus:ring-2 focus:ring-primary text-primary-foreground'
            >
              Update
            </Button>
          )}
          <Button
            type='button'
            onClick={() => handleDeletePayoutOrAdditionalCash(index)}
            size='sm'
            variant='destructive'
            disabled={loading}
          >
            <Trash2 className='w-5 h-5' />
          </Button>
        </div>
      </div>
    </div>
  );
}
