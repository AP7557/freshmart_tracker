'use client';

import { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import {
  ArrowLeft,
  Check,
  Building,
  Tag,
  DollarSign,
  FileText,
  CheckCircle,
  Calendar,
} from 'lucide-react';
import { format, isBefore, startOfDay } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PostedPayoutsType } from '@/types/type';
import { getTypeBadgeStyle } from './get-badge';

export default function SwipeList({
  payout,
  markCheckDeposited,
}: {
  payout: PostedPayoutsType;
  markCheckDeposited: (payoutId: number) => void;
}) {
  const [offset, setOffset] = useState(0);

  const handlers = useSwipeable({
    onSwiping: (e) => {
      if (payout.check_number) setOffset(Math.min(0, e.deltaX));
    },
    onSwipedLeft: (e) => {
      if (payout.check_number && e.absX > 220) markCheckDeposited(payout.id);
      else setOffset(0);
    },
    onSwipedRight: () => setOffset(0),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  return (
    <div
      key={payout.id}
      className='relative overflow-hidden rounded-lg'
      {...handlers}
    >
      {/* Background */}
      <div className='absolute inset-0 bg-green-500 flex items-center justify-end pr-6'>
        <Check className='text-white w-5 h-5 flex-shrink-0' /> Mark Posted
      </div>

      <div
        className={cn(
          'relative bg-background rounded-lg shadow-md transition-transform duration-200 ease-out',
          'touch-none'
        )}
        style={{ transform: `translateX(${offset}px)` }}
      >
        <Card className='shadow-none border-none'>
          <CardContent className='p-4 space-y-3'>
            {payout.created_at && (
              <div className='flex items-center gap-2 font-semibold text-foreground mb-2 justify-end'>
                <Calendar className='w-5 h-5 flex-shrink-0' />
                {format(new Date(payout.created_at), 'yyyy-MM-dd')}
              </div>
            )}
            {/* Company */}
            <p className='flex items-center gap-2 font-semibold text-foreground mb-1'>
              <Building className='w-5 h-5 flex-shrink-0 text-muted-foreground' />
              {payout.company_name}
            </p>

            {/* Type & Amount */}
            <div className='flex flex-wrap gap-3 mb-2 items-center'>
              <Badge
                variant='secondary'
                className={cn(
                  'capitalize px-2 py-1 font-semibold rounded flex items-center gap-1 text-white shadow-sm',
                  getTypeBadgeStyle(payout.type_name)
                )}
              >
                <Tag className='w-5 h-5 flex-shrink-0' /> {payout.type_name}
              </Badge>
              <span className='font-semibold flex items-center gap-1 text-primary'>
                <DollarSign className='w-5 h-5 flex-shrink-0' />
                {payout.amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              </span>
            </div>

            {/* Details */}
            <div className='text-sm text-foreground space-y-1'>
              <div className='flex items-center gap-2'>
                <FileText className='w-5 h-5 flex-shrink-0 text-muted-foreground' />
                <span>
                  <span className='font-semibold'>Invoice #:</span>{' '}
                  {payout.invoice_number}
                </span>
              </div>

              {payout.check_number && (
                <div className='flex items-center gap-2'>
                  <CheckCircle className='w-5 h-5 flex-shrink-0 text-muted-foreground' />
                  <span>
                    <span className='font-semibold'>Check #:</span>{' '}
                    {payout.check_number}
                  </span>
                </div>
              )}

              {payout.type_name.toLowerCase().includes('ach') &&
                payout.date_to_withdraw && (
                  <div className='flex flex-col gap-1'>
                    <div className='flex items-center gap-2'>
                      <Calendar className='w-5 h-5 flex-shrink-0 text-muted-foreground' />
                      <span>
                        <span className='font-semibold'>Date to Withdraw:</span>{' '}
                        {format(
                          new Date(payout.date_to_withdraw),
                          'MM/dd/yyyy'
                        )}
                      </span>
                    </div>
                    <div
                      className={
                        isBefore(
                          new Date(payout.date_to_withdraw),
                          startOfDay(new Date())
                        )
                          ? 'text-sm text-red-500 mt-1'
                          : 'text-sm text-muted-foreground mt-1'
                      }
                    >
                      {`Note: This ACH payout will be marked posted after ${format(
                        new Date(payout.date_to_withdraw),
                        'MM/dd/yyyy'
                      )}`}
                    </div>
                  </div>
                )}
            </div>

            {/* Swipe hint */}
            {payout.check_number && (
              <div className='flex items-center gap-1 text-sm text-primary animate-pulse mt-2'>
                Swipe Left to Mark Posted <ArrowLeft size={14} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
