import { Save } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '../ui/table';
import { Button } from '../ui/button';
import { formatMoney } from '@/lib/utils/format-number';
import { RegisterForm } from '@/app/portal/stats/register/page';
import { UseFormReturn } from 'react-hook-form';
import {
  addWeeklyPayoutOrAdditionalCash,
  updateWeeklySummary,
} from '@/lib/api/register';

export type TotalEntries = {
  business: number;
  payout: number;
  card: number;
  overShort: number;
  cash: number;
};

export default function WeeklySummary({
  form,
  initialPb,
}: {
  form: UseFormReturn<RegisterForm>;
  initialPb: number;
}) {
  const [totals, setTotals] = useState({
    totalEntries: {
      business: 0,
      payout: 0,
      card: 0,
      overShort: 0,
      cash: 0,
    },
    totalPayoutAmount: 0,
    pbLastWeek: 0,
    totalAdditionalCash: 0,
    pbThisWeek: 0,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const subscription = form.watch((value) => {
      const { entries = [], payouts = [], additionalCash = [] } = value;

      const totalEntries: TotalEntries = entries.reduce<TotalEntries>(
        (acc, curr) => {
          acc.business += Number(curr?.business ?? 0);
          acc.payout += Number(curr?.payout ?? 0);
          acc.card += Number(curr?.card ?? 0);
          acc.overShort += Number(curr?.over_short ?? 0);
          acc.cash +=
            Number(curr?.business ?? 0) -
            Number(curr?.payout ?? 0) -
            Number(curr?.card ?? 0) +
            Number(curr?.over_short ?? 0);
          return acc;
        },
        { business: 0, payout: 0, card: 0, overShort: 0, cash: 0 }
      );

      const totalPayoutAmount = payouts.reduce(
        (sum, p) => sum + Number(p?.amount ?? 0),
        0
      );

      const totalAdditionalCash = additionalCash.reduce(
        (sum, p) => sum + Number(p?.amount ?? 0),
        0
      );

      const pbLastWeek = Number(initialPb) || 0;
      const pbThisWeek =
        pbLastWeek +
        totalEntries.cash +
        totalAdditionalCash -
        totalPayoutAmount;

      setTotals({
        totalEntries,
        totalPayoutAmount,
        pbLastWeek,
        totalAdditionalCash,
        pbThisWeek,
      });
    });

    return () => subscription.unsubscribe();
  }, [form, initialPb]);

  const handleSaveAndPrint = async () => {
    setLoading(true);
    const weekId = form.getValues('weekId');
    const payouts = form.getValues('payouts');
    const additionalCash = form.getValues('additionalCash');

    const payoutInserts = payouts
      .filter((p) => !p.id)
      .map((p) => ({
        week_id: weekId,
        name: p.name,
        amount: p.amount,
      }));

    const additionalCashInserts = additionalCash
      .filter((p) => !p.id)
      .map((p) => ({
        week_id: weekId,
        name: p.name,
        amount: p.amount,
      }));

    if (payoutInserts.length > 0) {
      await addWeeklyPayoutOrAdditionalCash(
        payoutInserts,
        'insert_weekly_payouts'
      );
    }
    if (additionalCashInserts.length > 0) {
      await addWeeklyPayoutOrAdditionalCash(
        additionalCashInserts,
        'insert_weekly_additional_cash'
      );
    }
    
    await updateWeeklySummary(weekId, totals)
      .then(() => {
        window.print();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Card className='border-border/50'>
      <CardHeader className='pb-4'>
        <div>
          <CardTitle className='text-lg font-semibold text-primary'>
            Weekly Summary
          </CardTitle>
          <p className='mt-1 text-sm text-muted-foreground'>
            Overview of weekly totals and calculations
          </p>
        </div>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='rounded-lg border border-border/50 overflow-hidden'>
          <Table>
            <TableHeader>
              <TableRow className='bg-muted/30 hover:bg-muted/30'>
                <TableHead className='font-semibold text-foreground'>
                  Item
                </TableHead>
                <TableHead className='text-right font-semibold text-foreground'>
                  Amount
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className='border-b border-border/50'>
                <TableCell className='font-medium'>PB Last Week</TableCell>
                <TableCell className='text-right font-medium'>
                  ${formatMoney(totals.pbLastWeek || initialPb)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='text-muted-foreground'>
                  Total Business
                </TableCell>
                <TableCell className='text-right font-medium text-primary'>
                  ${formatMoney(totals.totalEntries.business)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='text-muted-foreground'>
                  Total Daily Payout
                </TableCell>
                <TableCell className='text-right font-medium text-orange-400'>
                  ${formatMoney(totals.totalEntries.payout)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='text-muted-foreground'>
                  Total Card
                </TableCell>
                <TableCell className='text-right font-medium text-blue-400'>
                  ${formatMoney(totals.totalEntries.card)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='text-muted-foreground'>
                  Total Cash
                </TableCell>
                <TableCell className='text-right font-medium text-amber-400'>
                  ${formatMoney(Math.round(totals.totalEntries.cash))}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='text-muted-foreground'>
                  Total Over/Short
                </TableCell>
                <TableCell className='text-right font-medium text-red-400'>
                  ${formatMoney(totals.totalEntries.overShort)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='text-muted-foreground'>
                  Additional Cash
                </TableCell>
                <TableCell className='text-right font-medium text-amber-400'>
                  ${formatMoney(totals.totalAdditionalCash)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='text-muted-foreground'>
                  Total Payouts
                </TableCell>
                <TableCell className='text-right font-medium text-orange-400'>
                  ${formatMoney(totals.totalPayoutAmount)}
                </TableCell>
              </TableRow>
              <TableRow className='border-t-2 border-border bg-primary/5'>
                <TableCell className='font-semibold text-base'>
                  PB This Week
                </TableCell>
                <TableCell className='text-right font-semibold text-base text-primary'>
                  ${formatMoney(Math.round(totals.pbThisWeek))}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <Button
          type='button'
          className='w-full bg-primary hover:bg-primary/90 focus:ring-2 focus:ring-primary text-primary-foreground h-11 text-base font-medium'
          size='lg'
          onClick={handleSaveAndPrint}
          disabled={loading}
        >
          <Save className='mr-2 w-5 h-5' />
          Save Week & Print
        </Button>
      </CardContent>
    </Card>
  );
}
