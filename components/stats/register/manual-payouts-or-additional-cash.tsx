import { Plus, SaveAll } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '../../ui/card';
import { Button } from '../../ui/button';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { RegisterForm } from '@/app/portal/stats/register/page';
import {
  addWeeklyPayoutOrAdditionalCash,
  getWeeklyPayoutOrAdditionalCash,
} from '@/lib/api/register';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../ui/accordion';
import ManualPayoutsOrAdditionalCashCard from './manual-payouts-or-additional-cash-card';
import { formatMoney } from '@/lib/utils/format-number';

export default function ManualPayoutsOrAdditionalCash({
  form,
  title,
  name,
  rpcName,
  dbName,
}: {
  form: UseFormReturn<RegisterForm>;
  title: string;
  name: 'payouts' | 'additionalCash';
  rpcName: string;
  dbName: string;
}) {
  const [loading, setLoading] = useState(false);
  const weekId = form.watch('weekId');

  const {
    fields: PayoutOrAdditionalCashFields,
    append: appendPayoutOrAdditionalCash,
    replace: replacePayoutOrAdditionalCash,
    remove: removePayoutOrAdditionalCash,
    update: updatePayoutOrAdditionalCash,
  } = useFieldArray({
    control: form.control,
    name,
  });

  const handleAddPayoutOrAdditionalCash = () => {
    appendPayoutOrAdditionalCash({
      name: '',
      amount: 0,
    });
  };

  const handleSavePayoutOrAdditionalCash = async (values: RegisterForm) => {
    const currentValues = values[name];

    const payoutOrAdditionalCashInserts = currentValues
      .filter((p) => !p.id)
      .map((p) => ({
        week_id: weekId,
        name: p.name,
        amount: p.amount,
      }));

    if (payoutOrAdditionalCashInserts.length > 0) {
      setLoading(true);

      const data = await addWeeklyPayoutOrAdditionalCash(
        payoutOrAdditionalCashInserts,
        rpcName
      );

      if (data) {
        let i = 0;
        currentValues.forEach((p, idx) => {
          if (!p.id) {
            updatePayoutOrAdditionalCash(idx, {
              ...p,
              id: data[i],
            });
            i++;
          }
        });
      }

      setLoading(false);
    }
  };

  useEffect(() => {
    if (!weekId) return;
    (async () => {
      setLoading(true);
      const data = await getWeeklyPayoutOrAdditionalCash(weekId, dbName);

      if (data && data.length > 0) {
        // Map the data to match your field array structure if needed
        const formatted = data.map((entry) => {
          return {
            name: entry.name,
            amount: entry.amount,
            id: entry.id,
          };
        });
        // Populate the field array
        replacePayoutOrAdditionalCash(formatted);
      }

      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekId]);

  return (
    <Card className='border-border/50'>
      <CardHeader className='pb-4'>
        <CardTitle className='text-lg font-semibold text-primary'>
          {title}
        </CardTitle>
      </CardHeader>
      {!loading && (
        <CardContent>
          {PayoutOrAdditionalCashFields.length === 0 ? (
            <div className='text-center py-12 border border-dashed rounded-lg bg-muted/30'>
              <p className='text-sm font-medium text-foreground mb-1'>
                No {title.toLowerCase()} yet
              </p>
              <p className='text-xs text-muted-foreground'>
                Click &quot;Add {title}&quot; to get started
              </p>
            </div>
          ) : (
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-3'>
              {PayoutOrAdditionalCashFields.map((field, index) => {
                const fieldName = form.watch(`${name}.${index}.name`);
                const amount =
                  Number(form.watch(`${name}.${index}.amount`)) || 0;

                return (
                  <div
                    key={field.id}
                    className='rounded-lg border border-border/50 overflow-hidden hover:border-primary/30 transition-colors'
                  >
                    {/* mobile version */}
                    <div className='lg:hidden'>
                      <Accordion type='single' collapsible>
                        <AccordionItem
                          value={`entry-${field.id}`}
                          className='border-0'
                        >
                          <AccordionTrigger className='px-4 py-3 hover:no-underline hover:bg-muted/30'>
                            <div className='flex gap-2 justify-between w-full'>
                              <span className='text-foreground'>
                                {fieldName}
                              </span>
                              <div className='flex flex-col'>
                                <span className='text-muted-foreground'>
                                  Amount
                                </span>
                                <span className='text-amber-400'>
                                  ${formatMoney(amount)}
                                </span>
                              </div>
                            </div>
                          </AccordionTrigger>

                          <AccordionContent className='pt-0 pb-0 px-0'>
                            <div className='border-t bg-muted/20'>
                              <ManualPayoutsOrAdditionalCashCard
                                form={form}
                                removePayoutOrAdditionalCash={
                                  removePayoutOrAdditionalCash
                                }
                                index={index}
                                loading={loading}
                                setLoading={setLoading}
                                dbName={dbName}
                                name={name}
                                title={title}
                              />
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>

                    {/* desktop version */}
                    <div className='hidden lg:block'>
                      <ManualPayoutsOrAdditionalCashCard
                        form={form}
                        removePayoutOrAdditionalCash={
                          removePayoutOrAdditionalCash
                        }
                        index={index}
                        loading={loading}
                        setLoading={setLoading}
                        dbName={dbName}
                        name={name}
                        title={title}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      )}
      <CardFooter className='flex justify-between'>
        <Button
          type='button'
          onClick={handleAddPayoutOrAdditionalCash}
          disabled={loading}
          className='bg-primary hover:bg-primary/90 focus:ring-2 focus:ring-primary text-primary-foreground'
        >
          <Plus className='mr-2 w-5 h-5' />
          Add {title}
        </Button>
        {PayoutOrAdditionalCashFields.length > 0 && (
          <Button
            type='button'
            onClick={form.handleSubmit((values: RegisterForm) =>
              handleSavePayoutOrAdditionalCash(values)
            )}
            disabled={loading}
            className='bg-primary hover:bg-primary/90 focus:ring-2 focus:ring-primary text-primary-foreground'
          >
            <SaveAll className='w-5 h-5' />
            Save {title}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
