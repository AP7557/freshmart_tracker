'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { ComboBox } from '@/components/shared/combobox';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { DatePicker } from '@/components/shared/date-picker';
import { TodaysPayouts } from '@/components/vendor/todays-payout';
import {
  Store,
  Briefcase,
  Tag,
  DollarSign,
  FileText,
  CheckCircle,
  Calendar,
} from 'lucide-react';
import { FormSchema, TodaysPayoutsType } from '@/types/type';
import ConfirmPayout from '@/components/vendor/confirm-payout';
import { LabelWithIcon } from '@/components/shared/label-with-icon';
import { useGlobalData } from '@/app/portal/GlobalDataProvider';
import { addPayout, getTodaysPayoutsCached } from '@/lib/api/payouts';

export default function AddPayoutForm() {
  const router = useRouter();
  const { userRole, storeOptions, companyOptions, typeOptions } =
    useGlobalData();

  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [todaysPayouts, setTodaysPayouts] = useState<TodaysPayoutsType[]>([]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      storeName: '',
      companyName: '',
      type: '',
      amount: 0,
      invoiceNumber: '',
      checkNumber: undefined,
      dateToWithdraw: new Date(),
    },
  });

  const type = form.watch('type');
  const storeName = form.watch('storeName');

  const handlePreSubmit = (values: z.infer<typeof FormSchema>) => {
    if (values.type !== 'Check Payment') {
      form.setValue('checkNumber', undefined);
      values.checkNumber = undefined;
    }
    if (values.type !== 'ACH Payment') {
      form.setValue('dateToWithdraw', undefined);
      values.dateToWithdraw = undefined;
    }

    setConfirmOpen(true);
  };

  const handleConfirmSubmit = async (values: z.infer<typeof FormSchema>) => {
    setLoading(true);
    const storeId =
      storeOptions.find((s) => s.name === values.storeName)?.id || 0;

    const storeExists = storeOptions.some((s) => s.name === values.storeName);
    const companyExists = companyOptions.some(
      (c) => c.name === values.companyName
    );
    const shouldInvalidateInitialData = {
      storeExists,
      companyExists,
    };

    const payoutsData = await addPayout(
      values,
      storeId,
      shouldInvalidateInitialData
    );

    if (payoutsData?.data) {
      router.refresh();
      form.reset();
      form.setValue('storeName', values.storeName);

      const filteredPayouts = todaysPayouts.filter(
        (value) => value.store_name === values.storeName
      );

      setTodaysPayouts([payoutsData.data[0], ...filteredPayouts]);
    }

    setLoading(false);
    setConfirmOpen(false);
  };

  useEffect(() => {
    (async () => {
      if (storeName) {
        const todaysPayout = await getTodaysPayoutsCached(
          storeOptions,
          storeName
        );
        if (todaysPayout?.payoutData) {
          setTodaysPayouts(todaysPayout.payoutData);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeName]);

  return (
    <div className='p-6 bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm max-w-5xl mx-auto'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handlePreSubmit)}
          className='space-y-6'
          noValidate
        >
          <FormField
            control={form.control}
            name='storeName'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <LabelWithIcon icon={Store}>Store Name</LabelWithIcon>
                <ComboBox
                  options={storeOptions}
                  selectedValue={field.value}
                  setValue={(value: string) => form.setValue(field.name, value)}
                  placeholder='Select a store'
                  canAddNewValues={userRole === 'admin'}
                />
                <FormMessage className='text-red-500 mt-1 text-sm' />
              </FormItem>
            )}
          />
          {storeName && (
            <>
              <FormField
                control={form.control}
                name='companyName'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <LabelWithIcon icon={Briefcase}>Company</LabelWithIcon>
                    <ComboBox
                      options={companyOptions}
                      selectedValue={field.value}
                      setValue={(value: string) =>
                        form.setValue(field.name, value)
                      }
                      placeholder='Select a company'
                    />
                    <FormMessage className='text-red-500 mt-1 text-sm' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='type'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <LabelWithIcon icon={Tag}>Type</LabelWithIcon>
                    <ComboBox
                      options={typeOptions}
                      selectedValue={field.value}
                      setValue={(value: string) =>
                        form.setValue(field.name, value)
                      }
                      canAddNewValues={false}
                      placeholder='Select type'
                    />
                    <FormMessage className='text-red-500 mt-1 text-sm' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='amount'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <LabelWithIcon icon={DollarSign}>Amount</LabelWithIcon>
                    <Input
                      {...field}
                      value={field.value === 0 ? '' : field.value}
                      type='number'
                      placeholder='Enter amount'
                      className='text-base focus:ring-2 focus:ring-primary'
                      step='0.01'
                      onChange={(e) => {
                        const el = e.target;
                        // RHF's register has { valueAsNumber: true }; emulate that here:
                        // empty -> undefined (so "required" can trigger)
                        const next =
                          el.value === '' ? undefined : el.valueAsNumber; // NaN if invalid
                        field.onChange(Number.isNaN(next) ? undefined : next);
                      }}
                      onWheel={(e) => e.currentTarget.blur()} // prevents scroll from changing number
                    />
                    <FormMessage className='text-red-500 mt-1 text-sm' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='invoiceNumber'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <LabelWithIcon icon={FileText}>
                      Invoice Number
                    </LabelWithIcon>
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      placeholder='Enter invoice number'
                      className='text-base focus:ring-2 focus:ring-primary'
                    />
                    <FormMessage className='text-red-500 mt-1 text-sm' />
                  </FormItem>
                )}
              />

              {type === 'Check Payment' && (
                <FormField
                  control={form.control}
                  name='checkNumber'
                  render={({ field }) => (
                    <FormItem className='flex flex-col'>
                      <LabelWithIcon icon={CheckCircle}>
                        Check Number
                      </LabelWithIcon>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        type='number'
                        placeholder='Enter check number'
                        className='text-base focus:ring-2 focus:ring-primary'
                        onChange={(e) => {
                          const el = e.target;
                          // RHF's register has { valueAsNumber: true }; emulate that here:
                          // empty -> undefined (so "required" can trigger)
                          const next =
                            el.value === '' ? undefined : el.valueAsNumber; // NaN if invalid
                          field.onChange(Number.isNaN(next) ? undefined : next);
                        }}
                        onWheel={(e) => e.currentTarget.blur()} // prevents scroll from changing number
                      />
                      <FormMessage className='text-red-500 mt-1 text-sm' />
                    </FormItem>
                  )}
                />
              )}

              {type === 'ACH Payment' && (
                <FormField
                  control={form.control}
                  name='dateToWithdraw'
                  render={({ field }) => (
                    <FormItem className='flex flex-col'>
                      <LabelWithIcon icon={Calendar}>
                        Date to Withdraw
                      </LabelWithIcon>
                      <DatePicker
                        placeholder='Select a date'
                        selectedValue={field.value ?? new Date()}
                        setValue={(value: Date) => field.onChange(value)}
                      />
                      <FormMessage className='text-red-500 mt-1 text-sm' />
                    </FormItem>
                  )}
                />
              )}

              <Button
                type='submit'
                disabled={loading}
                className='w-full py-3 text-lg font-semibold'
              >
                {loading ? 'Saving...' : 'Submit Payout'}
              </Button>
            </>
          )}
        </form>
      </Form>

      <ConfirmPayout
        confirmOpen={confirmOpen}
        setConfirmOpen={setConfirmOpen}
        getFormValues={() => form.getValues()} // instead of pendingValues
        handleConfirmSubmit={handleConfirmSubmit}
        loading={loading}
      />

      <div className='mt-1'>
        <TodaysPayouts todaysPayouts={todaysPayouts} />
      </div>
    </div>
  );
}
