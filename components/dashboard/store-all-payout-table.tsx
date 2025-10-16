'use client';
import { useMemo, useState } from 'react';
import { DatePicker } from '../shared/date-picker';
import { ComboBox } from '../shared/combobox';

import MobileTable from '../shared/mobile-table';
import { AllPayoutsType, OptionsType } from '@/types/type';
import { Button } from '../ui/button';
import DesktopTable from '../shared/desktop-table';

function toLocalYMD(date: Date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function StorePayoutTable({ payouts }: { payouts: AllPayoutsType[] }) {
  const [companyFilter, setCompanyFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filtered = useMemo(() => {
    return payouts.filter((payout) => {
      const payoutDate = new Date(payout.created_at);
      const payoutYMD = toLocalYMD(payoutDate);
      const startYMD = startDate ? toLocalYMD(startDate) : null;
      const endYMD = endDate ? toLocalYMD(endDate) : null;

      setCurrentPage(1); // Reset to page 1 on filter change

      return (
        (!companyFilter || payout.company_name === companyFilter) &&
        (!typeFilter || payout.type_name === typeFilter) &&
        (!startYMD || payoutYMD >= startYMD) &&
        (!endYMD || payoutYMD <= endYMD)
      );
    });
  }, [payouts, companyFilter, typeFilter, startDate, endDate]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  const { companies, types } = payouts.reduce(
    (acc, payout) => {
      if (!acc.companies[payout.company_id]) {
        acc.companies[payout.company_id] = {
          id: payout.company_id,
          name: payout.company_name,
        };
      }
      if (!acc.types[payout.type_id]) {
        acc.types[payout.type_id] = {
          id: payout.type_id,
          name: payout.type_name,
        };
      }
      return acc;
    },
    {
      companies: {} as Record<number, OptionsType[0]>,
      types: {} as Record<number, OptionsType[0]>,
    }
  );

  const companyOptions: OptionsType = Object.values(companies);
  const typeOptions: OptionsType = Object.values(types);

  return (
    <div className='space-y-4'>
      {/* Filters */}
      <div className='flex flex-col md:flex-row gap-4'>
        <div className='w-full flex flex-col gap-4'>
          <ComboBox
            options={companyOptions}
            selectedValue={companyFilter}
            placeholder='Filter by Company'
            setValue={setCompanyFilter}
          />
          <ComboBox
            options={typeOptions}
            selectedValue={typeFilter}
            placeholder='Filter by Type'
            setValue={setTypeFilter}
          />
          <div className='flex flex-col md:flex-row gap-2'>
            <div className='w-full'>
              <DatePicker
                selectedValue={startDate as Date}
                setValue={setStartDate}
                placeholder='From'
                shouldBeDisabled={false}
              />
            </div>
            <div className='w-full'>
              <DatePicker
                selectedValue={endDate as Date}
                setValue={setEndDate}
                placeholder='To'
                shouldBeDisabled={false}
              />
            </div>
          </div>
          <div className='flex justify-end'>
            <Button
              variant='secondary'
              className='text-primary'
              onClick={() => {
                setCompanyFilter('');
                setTypeFilter('');
                setStartDate(undefined);
                setEndDate(undefined);
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className='text-muted-foreground text-sm text-center py-6 italic'>
          No payouts found.
        </p>
      ) : (
        <>
          {/* Desktop Table */}
          <DesktopTable payouts={paginated} />

          {/* Mobile Cards with icons */}
          <MobileTable payouts={paginated} />
        </>
      )}
      <div className='flex justify-center items-center gap-4 py-4'>
        <Button
          variant={'secondary'}
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className='text-primary'
        >
          Previous
        </Button>
        <span className='text-sm text-muted-foreground'>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant={'secondary'}
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className='text-primary'
        >
          Next
        </Button>
      </div>
    </div>
  );
}
