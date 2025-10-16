import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { format } from 'date-fns';
import {
  Building,
  Tag,
  DollarSign,
  FileText,
  CheckCircle,
  Calendar,
} from 'lucide-react';
import {
  AllPayoutsType,
  PostedPayoutsType,
  TodaysPayoutsType,
} from '@/types/type';
import { getTypeBadgeStyle } from './get-badge';

export default function MobileTable({
  payouts,
}: {
  payouts: AllPayoutsType[] | PostedPayoutsType[] | TodaysPayoutsType[];
}) {
  return (
    <div className='space-y-4 md:hidden'>
      {payouts.map((payout, i) => (
        <div
          key={i}
          className='border border-border rounded-md shadow-md overflow-hidden'
        >
          <div
            className={cn('h-2 w-full', getTypeBadgeStyle(payout.type_name))}
          ></div>
          <div className='p-4 bg-[hsl(var(--card))]'>
            {(payout as AllPayoutsType).created_at && (
              <div className='flex items-center gap-2 font-semibold text-foreground mb-2 justify-end'>
                <Calendar className='w-5 h-5 flex-shrink-0' />
                {format(
                  new Date((payout as AllPayoutsType).created_at),
                  'yyyy-MM-dd'
                )}
              </div>
            )}
            <p className='flex items-center gap-2 font-semibold text-foreground mb-2'>
              <Building className='w-5 h-5 flex-shrink-0' />
              {payout.company_name}
            </p>
            <div className='flex justify-between gap-4 mb-2 items-center'>
              <Badge
                variant='secondary'
                className={cn(
                  'capitalize px-2 py-1 font-semibold rounded flex items-center gap-1',
                  getTypeBadgeStyle(payout.type_name)
                )}
              >
                <Tag className='w-5 h-5 flex-shrink-0' />
                {payout.type_name}
              </Badge>
              <span
                className={'font-semibold flex items-center gap-1 text-primary'}
              >
                <DollarSign className='w-5 h-5 flex-shrink-0' />
                {payout.amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              </span>
            </div>

            <div className='text-sm text-foreground space-y-2'>
              <div className='flex items-center gap-2'>
                <FileText className='w-5 h-5 flex-shrink-0' />
                <span>
                  <span className='font-semibold'>Invoice #:</span>{' '}
                  {payout.invoice_number}
                </span>
              </div>
              {payout.type_name.includes('Check') && (
                <div className='flex items-center gap-2'>
                  <CheckCircle className='w-5 h-5 flex-shrink-0' />
                  <span>
                    <span className='font-semibold'>Check #:</span>{' '}
                    {payout.check_number ?? '--'}
                  </span>
                </div>
              )}
              {payout.type_name.includes('ACH') && (
                <div className='flex items-center gap-2'>
                  <Calendar className='w-5 h-5 flex-shrink-0' />
                  <span>
                    <span className='font-semibold'>Date to Withdraw:</span>{' '}
                    {payout.date_to_withdraw
                      ? format(new Date(payout.date_to_withdraw), 'MM/dd/yyyy')
                      : '--'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
