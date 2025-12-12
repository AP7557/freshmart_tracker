'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';

import { Store, Calendar } from 'lucide-react';
import { ComboBox } from '@/components/shared/combobox';
import { LabelWithIcon } from '@/components/shared/label-with-icon';
import { useGlobalData } from '../../GlobalDataProvider';
import { getCurrentWeekDateUTC } from '@/lib/utils/week-calculation';

import DailyEntries from '@/components/stats/register/daily-entries';
import WeeklySummary from '@/components/stats/register/weekly-summary';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  createRegisterWeekWithNoPB,
  getOrCreateWeekEntry,
} from '@/lib/api/register';
import ManualPayoutsOrAdditionalCash from '@/components/stats/register/manual-payouts-or-additional-cash';
import { Loader2 } from 'lucide-react';
import WeeklyPrint from '@/components/stats/register/weekly-print';

const numericField = z
  .number('This field is required')
  .min(0, 'Must be >= 0')
  .refine((val) => /^\d+(\.\d{1,2})?$/.test(String(val)), 'Up to 2 decimals');

const registerEntrySchema = z.object({
  entry_date: z.date(),
  business: numericField,
  payout: numericField,
  card: numericField,
  over_short: z.union([z.string(), z.number()]).optional(),
  cash: z.number().optional(),
  entry_id: z.number().optional(),
});

const registeradditionalSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  amount: numericField,
  id: z.number().optional(),
});

const registerFormSchema = z.object({
  storeName: z.string().min(1, 'Store is required'),
  weekId: z.number(),
  entries: z.array(registerEntrySchema),
  payouts: z.array(registeradditionalSchema),
  additionalCash: z.array(registeradditionalSchema),
});

export type RegisterForm = z.infer<typeof registerFormSchema>;

export default function RegisterPage() {
  const { storeOptions } = useGlobalData();
  const [loading, setLoading] = useState(false);
  const { weekStart, weekEnd } = getCurrentWeekDateUTC();
  const [showInitialPbDialog, setShowInitialPbDialog] = useState(false);
  const [initialPb, setInitialPb] = useState<number>(0);

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      storeName: '',
      entries: [],
      payouts: [],
      additionalCash: [],
    },
  });

  const storeName = form.watch('storeName');

  useEffect(() => {
    (async () => {
      if (storeName) {
        const storeId = storeOptions.find((s) => s.name === storeName)?.id;
        if (storeId) {
          setLoading(true);
          setInitialPb(0);

          const data = await getOrCreateWeekEntry(storeId);
          if (data) {
            if (data[0].needs_pb) {
              setShowInitialPbDialog(true);
            } else {
              setInitialPb(data[0].last_pb);
              form.setValue('weekId', data[0].week_id);
            }
          }

          setLoading(false);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeName]);

  return (
    <>
      <div className='min-h-screen bg-background print:hidden'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12'>
          <div className='space-y-6 sm:space-y-8'>
            <Form {...form}>
              <Card>
                <CardHeader className='flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-md border w-fit self-end mr-3'>
                  <Calendar className='w-5 h-5' />
                  <span className='font-medium'>
                    {weekStart} - {weekEnd}
                  </span>
                </CardHeader>

                <CardContent>
                  <FormField
                    control={form.control}
                    name='storeName'
                    render={({ field }) => (
                      <FormItem className='space-y-3'>
                        <LabelWithIcon icon={Store}>Store Name</LabelWithIcon>
                        <ComboBox
                          options={storeOptions}
                          selectedValue={field.value}
                          setValue={(value: string) =>
                            form.setValue(field.name, value)
                          }
                          placeholder='Select a store'
                          canAddNewValues={false}
                        />
                        <FormMessage className='text-sm' />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {loading && (
                <Card>
                  <CardContent className='flex items-center justify-center py-12'>
                    <div className='flex flex-col items-center gap-3'>
                      <Loader2 className='h-6 w-6 animate-spin text-primary' />
                      <p className='text-sm text-muted-foreground'>
                        Loading data...
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {!loading && storeName && (
                <div className='space-y-6 sm:space-y-8'>
                  <DailyEntries form={form} />
                  <ManualPayoutsOrAdditionalCash
                    form={form}
                    name={'payouts'}
                    title={'Payouts'}
                    rpcName='insert_weekly_payouts'
                    dbName='register_weekly_payouts'
                  />
                  <ManualPayoutsOrAdditionalCash
                    form={form}
                    name={'additionalCash'}
                    title={'Additional Cash'}
                    rpcName='insert_weekly_additional_cash'
                    dbName='register_weekly_additional_cash'
                  />
                  <WeeklySummary form={form} initialPb={initialPb} />
                </div>
              )}
            </Form>
          </div>
        </div>

        <Dialog
          open={showInitialPbDialog}
          onOpenChange={setShowInitialPbDialog}
        >
          <DialogContent
            onInteractOutside={(e) => e.preventDefault()}
            className='sm:max-w-md'
          >
            <DialogHeader>
              <DialogTitle className='text-xl font-semibold'>
                Enter Initial PB
              </DialogTitle>
              <DialogDescription className='text-sm text-muted-foreground'>
                This is the first week for this store. Please enter the initial
                PB amount.
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-4 py-4'>
              <div className='space-y-2'>
                <label className='text-sm font-medium text-primary'>
                  Initial PB Amount
                </label>
                <Input
                  type='number'
                  placeholder='0.00'
                  value={initialPb}
                  onChange={(e) => setInitialPb(Number(e.target.value))}
                  className='focus:ring-2 focus:ring-primary'
                  step='0.01'
                />
              </div>
            </div>
            <DialogFooter className='gap-2 sm:gap-0'>
              <Button
                onClick={async () => {
                  const storeId = storeOptions.find(
                    (s) => s.name === storeName
                  )?.id;

                  if (storeId) {
                    setLoading(true);
                    await createRegisterWeekWithNoPB(initialPb, storeId).then(
                      (data) => {
                        form.setValue('weekId', data?.id);
                        setShowInitialPbDialog(false);
                      }
                    );
                    setLoading(false);
                  }
                }}
                disabled={loading || !initialPb}
                className='bg-primary hover:bg-primary/90 focus:ring-2 focus:ring-primary'
              >
                {loading ? (
                  <>
                    <Loader2 className='mr-2 w-5 h-5 animate-spin' />
                    Creating...
                  </>
                ) : (
                  'Continue'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className='register-print'>
        <WeeklyPrint form={form} initialPb={initialPb} />
      </div>
    </>
  );
}
