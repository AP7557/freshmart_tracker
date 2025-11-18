import { Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '../ui/card';
import { Button } from '../ui/button';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { RegisterForm } from '@/app/portal/stats/register/page';
import { getDailyEntries } from '@/lib/api/register';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import DailyEntriesCard from './daily-entries-card';
import { formatMoney } from '@/lib/utils/format-number';

export default function DailyEntries({
  form,
}: {
  form: UseFormReturn<RegisterForm>;
}) {
  const [loading, setLoading] = useState(false);
  form.watch('entries');
  const weekId = form.watch('weekId');

  const {
    fields: entryFields,
    update: updateEntry,
    remove: removeEntry,
    append: appendEntry,
    replace: replaceEntry,
  } = useFieldArray({
    control: form.control,
    name: 'entries',
  });

  const d = new Date();
  const handleAddEntry = () => {
    if (entryFields.length >= 7) {
      alert('You can only add up to 7 entries per week.');
      return;
    }

    appendEntry({
      entry_date: new Date(d.setDate(d.getDate() - 1)),
      business: 0,
      payout: 0,
      card: 0,
      over_short: 0,
    });
  };

  useEffect(() => {
    if (!weekId) return;
    (async () => {
      setLoading(true);
      const data = await getDailyEntries(weekId);

      if (data && data.length > 0) {
        // Map the data to match your field array structure if needed
        const formatted = data.map((entry) => {
          const [year, month, day] = entry.entry_date.split('-').map(Number);
          const dateObj = new Date(year, month - 1, day);

          return {
            entry_date: dateObj,
            business: entry.business,
            payout: entry.payout,
            card: entry.card,
            over_short: entry.over_short,
            cash: entry.cash,
            entry_id: entry.id, // existing entry id from DB
          };
        });
        // Populate the field array
        replaceEntry(formatted);
        form.reset({
          ...form.getValues(),
          entries: formatted,
        });
      }

      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekId]);

  return (
    <Card className='border-border/50'>
      <CardHeader className='pb-4'>
        <CardTitle className='text-lg font-semibold text-primary'>
          Daily Entries
        </CardTitle>
      </CardHeader>
      {!loading && (
        <CardContent>
          {entryFields.length === 0 ? (
            <div className='text-center py-12 border border-dashed rounded-lg bg-muted/30'>
              <p className='text-sm font-medium text-foreground mb-1'>
                No entries yet
              </p>
              <p className='text-xs text-muted-foreground'>
                Click &quot;Add Entry&quot; to get started
              </p>
            </div>
          ) : (
            <div className='space-y-3'>
              {entryFields.map((field, index) => {
                const date = form.watch(`entries.${index}.entry_date`);
                const business =
                  Number(form.watch(`entries.${index}.business`)) || 0;
                const payout =
                  Number(form.watch(`entries.${index}.payout`)) || 0;
                const card = Number(form.watch(`entries.${index}.card`)) || 0;
                const over =
                  Number(form.watch(`entries.${index}.over_short`)) || 0;
                const cash = Math.round(business - payout - card + over);

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
                              <span className='text-sm font-semibold text-foreground'>
                                {date.toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </span>
                              <span className='text-right'>
                                <span className='text-muted-foreground'>
                                  Business:{' '}
                                </span>
                                <span className='font-semibold text-primary'>
                                  ${formatMoney(business)}
                                </span>
                              </span>
                              <span className='text-right'>
                                <span className='text-muted-foreground'>
                                  Cash:{' '}
                                </span>
                                <span className='font-semibold text-amber-400'>
                                  ${formatMoney(cash)}
                                </span>
                              </span>
                            </div>
                          </AccordionTrigger>

                          <AccordionContent className='pt-0 pb-0 px-0'>
                            <div className='border-t bg-muted/20'>
                              <DailyEntriesCard
                                form={form}
                                removeEntry={removeEntry}
                                updateEntry={updateEntry}
                                index={index}
                                loading={loading}
                                setLoading={setLoading}
                                weekId={weekId}
                                cashValue={cash}
                              />
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>

                    {/* desktop version */}
                    <div className='hidden lg:block'>
                      <DailyEntriesCard
                        form={form}
                        removeEntry={removeEntry}
                        updateEntry={updateEntry}
                        index={index}
                        loading={loading}
                        setLoading={setLoading}
                        weekId={weekId}
                        cashValue={cash}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      )}
      <CardFooter className='flex justify-end'>
        <Button
          type='button'
          onClick={handleAddEntry}
          disabled={loading}
          className='bg-primary hover:bg-primary/90 focus:ring-2 focus:ring-primary text-primary-foreground'
        >
          <Plus className='mr-2 w-5 h-5' />
          Add Entry
        </Button>
      </CardFooter>
    </Card>
  );
}
