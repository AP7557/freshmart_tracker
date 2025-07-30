import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { format } from 'date-fns';
import { Button } from '../ui/button';
import {
  AllPayoutsType,
  PostedPayoutsType,
  TodaysPayoutsType,
} from '@/types/type';
import { getTypeBadgeStyle } from './get-badge';

export default function DesktopTable({
  payouts,
  isActionable = false,
  markCheckDeposited = () => {},
}: {
  payouts: AllPayoutsType[] | PostedPayoutsType[] | TodaysPayoutsType[];
  isActionable?: boolean;
  markCheckDeposited?: (payoutId: number) => void;
}) {
  let tableHeader = [
    'Company',
    'Type',
    'Amount',
    'Invoice #',
    'Check #',
    'Date to Withdraw',
  ];

  if ((payouts as AllPayoutsType[])[0]?.created_at) {
    tableHeader = ['Payout Date', ...tableHeader];
  }

  if (isActionable) {
    tableHeader = [...tableHeader, 'Action'];
  }

  return (
    <div className='hidden md:block'>
      <Table className='w-full border-collapse'>
        <TableHeader>
          <TableRow className='bg-muted/50'>
            {tableHeader.map((header) => (
              <TableHead
                key={header}
                className='border border-border px-3 py-2 text-left text-muted-foreground font-semibold text-wrap'
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {payouts.map((payout, i) => (
            <TableRow
              key={i}
              className={`transition-all duration-200 ${
                i % 2 === 0 ? 'bg-[hsl(var(--muted)/0.25)]' : ''
              } hover:shadow-md hover:bg-[hsl(var(--muted)/0.4)]`}
            >
              {(payout as AllPayoutsType).created_at && (
                <TableCell className='border border-border px-3 py-2'>
                  {format(
                    new Date((payout as AllPayoutsType).created_at),
                    'yyyy-MM-dd'
                  )}
                </TableCell>
              )}
              <TableCell className='border border-border px-3 py-2 font-medium text-wrap'>
                {payout.company_name}
              </TableCell>
              <TableCell className='border border-border px-3 py-2'>
                <Badge
                  variant='secondary'
                  className={cn(
                    'capitalize px-2 py-1 font-semibold rounded text-white shadow-sm',
                    getTypeBadgeStyle(payout.type_name)
                  )}
                >
                  {payout.type_name}
                </Badge>
              </TableCell>
              <TableCell className='border border-border px-3 py-2 text-right font-semibold text-primary'>
                ${' '}
                {payout.amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              </TableCell>
              <TableCell className='border border-border px-3 py-2'>
                {payout.invoice_number}
              </TableCell>
              <TableCell className='border border-border px-3 py-2'>
                {payout.check_number ?? '--'}
              </TableCell>
              <TableCell className='border border-border px-3 py-2'>
                {payout.date_to_withdraw
                  ? format(new Date(payout.date_to_withdraw), 'yyyy-MM-dd')
                  : '--'}
              </TableCell>
              {isActionable && (
                <TableCell className='border border-border px-3 py-2'>
                  {payout.check_number && (
                    <Button
                      size='sm'
                      className='rounded-full'
                      onClick={() =>
                        markCheckDeposited(
                          (payout as PostedPayoutsType).id as number
                        )
                      }
                    >
                      Mark Posted
                    </Button>
                  )}
                  {payout.type_name.toLowerCase() === 'ach payment' &&
                    payout.date_to_withdraw && (
                      <div
                        className={
                          'text-sm text-muted-foreground mt-1 text-wrap'
                        }
                      >
                        {`Note: This ACH payout will be marked posted after ${format(
                          new Date(payout.date_to_withdraw),
                          'yyyy-MM-dd'
                        )}`}
                      </div>
                    )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
