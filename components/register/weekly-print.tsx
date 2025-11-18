import { formatMoney } from '@/lib/utils/format-number';
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { UseFormReturn } from 'react-hook-form';
import { RegisterForm } from '@/app/portal/stats/register/page';
import { TotalEntries } from './weekly-summary';

export default function WeeklyPrint({
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

  const [entries, setEntries] = useState<RegisterForm['entries']>([]);
  const [payouts, setPayouts] = useState<RegisterForm['payouts']>([]);
  const [additionalCash, setAdditionalCash] = useState<
    RegisterForm['additionalCash']
  >([]);

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

      setEntries((entries ?? []).filter(Boolean) as RegisterForm['entries']);
      setPayouts((payouts ?? []).filter(Boolean) as RegisterForm['payouts']);
      setAdditionalCash(
        (additionalCash ?? []).filter(Boolean) as RegisterForm['additionalCash']
      );
    });

    return () => subscription.unsubscribe();
  }, [form, initialPb]);

  return (
    <div className='hidden print:block weekly-print-container text-black'>
      {/* Daily entries table */}
      <Table className='w-full border-collapse border border-neutral-300'>
        <TableHeader>
          <TableRow className='bg-green-300'>
            {['Date', 'Business', 'Payout', 'Cash', 'Card', 'Over/Short'].map(
              (col) => (
                <TableHead
                  key={col}
                  className='px-2 py-1 font-bold border text-black border-neutral-300'
                >
                  {col}
                </TableHead>
              )
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((e, i) => (
            <TableRow
              key={i}
              className={i % 2 === 0 ? 'bg-white' : 'bg-green-100'}
            >
              <TableCell className='px-2 py-1 border border-neutral-300'>
                {e.entry_date?.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </TableCell>
              <TableCell className='px-2 py-1 border border-neutral-300'>
                {formatMoney(e.business ?? 0)}
              </TableCell>
              <TableCell className='px-2 py-1 border border-neutral-300'>
                {formatMoney(e.payout ?? 0)}
              </TableCell>
              <TableCell className='px-2 py-1 border border-neutral-300'>
                {formatMoney(Math.round(e.cash ?? 0))}
              </TableCell>
              <TableCell className='px-2 py-1 border border-neutral-300'>
                {formatMoney(e.card ?? 0)}
              </TableCell>
              <TableCell className='px-2 py-1 border border-neutral-300'>
                {formatMoney(e.over_short ?? 0)}
              </TableCell>
            </TableRow>
          ))}

          {/* Totals row */}
          <TableRow className='font-bold border-t-2 border-neutral-400 bg-green-600'>
            <TableCell className='px-2 py-1 border border-neutral-300'>
              Totals
            </TableCell>
            <TableCell className='px-2 py-1 border border-neutral-300'>
              {formatMoney(totals.totalEntries.business)}
            </TableCell>
            <TableCell className='px-2 py-1 border border-neutral-300'>
              {formatMoney(totals.totalEntries.payout)}
            </TableCell>
            <TableCell className='px-2 py-1 border border-neutral-300'>
              {formatMoney(Math.round(totals.totalEntries.cash))}
            </TableCell>
            <TableCell className='px-2 py-1 border border-neutral-300'>
              {formatMoney(totals.totalEntries.card)}
            </TableCell>
            <TableCell className='px-2 py-1 border border-neutral-300'>
              {formatMoney(totals.totalEntries.overShort)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div className='flex mt-4 gap-6'>
        {/* LEFT — Payouts */}
        <div className='flex-1'>
          <h3 className='text-lg underline mb-1 font-semibold'>Payouts</h3>
          <Table className='w-full border border-neutral-300'>
            <TableBody>
              {payouts.map((p, i) => (
                <TableRow
                  key={i}
                  className={i % 2 === 0 ? 'bg-white' : 'bg-green-100'}
                >
                  <TableCell className='px-2 py-1 border border-neutral-300'>
                    {p.name}
                  </TableCell>
                  <TableCell className='px-2 py-1 border border-neutral-300 text-right'>
                    {formatMoney(p.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* RIGHT — Additional Cash + Summary */}
        <div className='flex-1'>
          <h3 className='text-lg underline mb-1 font-semibold'>
            Additional Cash
          </h3>
          <Table className='w-full border border-neutral-300 mb-3'>
            <TableBody>
              {additionalCash.map((p, i) => (
                <TableRow
                  key={i}
                  className={i % 2 === 0 ? 'bg-white' : 'bg-green-100'}
                >
                  <TableCell className='px-2 py-1 border border-neutral-300'>
                    {p.name}
                  </TableCell>
                  <TableCell className='px-2 py-1 border border-neutral-300 text-right'>
                    {formatMoney(p.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <h3 className='text-lg underline  mb-1 font-semibold'>Summary</h3>
          <Table className='w-full border border-neutral-300 font-bold '>
            <TableBody>
              <TableRow className='bg-white'>
                <TableCell className='px-2 py-1 border border-neutral-300'>
                  PB Last Week
                </TableCell>
                <TableCell className='px-2 py-1 border border-neutral-300 text-right'>
                  {formatMoney(totals.pbLastWeek)}
                </TableCell>
              </TableRow>
              <TableRow className='bg-green-100'>
                <TableCell className='px-2 py-1 border border-neutral-300'>
                  Total Cash
                </TableCell>
                <TableCell className='px-2 py-1 border border-neutral-300 text-right'>
                  {formatMoney(Math.round(totals.totalEntries.cash))}
                </TableCell>
              </TableRow>
              <TableRow className='bg-white'>
                <TableCell className='px-2 py-1 border border-neutral-300'>
                  Total Additional Cash
                </TableCell>
                <TableCell className='px-2 py-1 border border-neutral-300 text-right'>
                  {formatMoney(totals.totalAdditionalCash)}
                </TableCell>
              </TableRow>
              <TableRow className='bg-green-100'>
                <TableCell className='px-2 py-1 border border-neutral-300'>
                  Total Payouts
                </TableCell>
                <TableCell className='px-2 py-1 border border-neutral-300 text-right'>
                  {formatMoney(totals.totalPayoutAmount)}
                </TableCell>
              </TableRow>
              <TableRow className='font-bold border-t-2 bg-green-400'>
                <TableCell className='px-2 py-1 border border-neutral-300'>
                  PB This Week
                </TableCell>
                <TableCell className='px-2 py-1 border border-neutral-300 text-right'>
                  {formatMoney(Math.round(totals.pbThisWeek))}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
