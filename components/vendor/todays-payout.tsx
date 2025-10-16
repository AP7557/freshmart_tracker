import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MobileTable from '../shared/mobile-table';
import { TodaysPayoutsType } from '@/types/type';
import DesktopTable from '../shared/desktop-table';

export function TodaysPayouts({
  todaysPayouts,
}: {
  todaysPayouts: TodaysPayoutsType[];
}) {
  return (
    <Card className='mt-8 shadow-lg border border-border rounded-lg overflow-hidden'>
      <CardHeader className='border-b border-border pb-4 bg-muted/30'>
        <CardTitle className='text-lg font-semibold text-center text-primary tracking-wide'>
          Today’s Payouts{' '}
          {todaysPayouts[0]?.store_name && `For ${todaysPayouts[0].store_name}`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {todaysPayouts.length === 0 ? (
          <p className='text-muted-foreground text-sm text-center py-6 italic'>
            No payouts for today.
          </p>
        ) : (
          <>
            {/* Desktop Table */}
            <DesktopTable payouts={todaysPayouts} />

            {/* Mobile stacked cards */}
            <MobileTable payouts={todaysPayouts} />
          </>
        )}
      </CardContent>
    </Card>
  );
}
