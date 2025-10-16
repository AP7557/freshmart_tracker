import { useMemo } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Badge, Boxes, DollarSign, Icon, Tag, TrendingUp } from 'lucide-react';
import { getChangeBadgeGradient, getChangeIcon } from '../shared/get-badge';

export default function DepartmentStatsView({
    viewData,
}: {
    viewData: {
        department: string;
        amount: number;
        prevAmount: number;
        change: number;
    }[];
}) {
    const tableHeader = [
        'Department',
        'Last Month Amount',
        'This Month Amount',
        '% Change'
    ]
    const hasData = useMemo(() => viewData && viewData.length > 0, [viewData]);

    if (!hasData) return null;

    const ChangeDisplay = ({ change }: { change: number }) => {
        const Icon = getChangeIcon(change);

        return (
            <span
                className={cn(
                    'px-2 py-1 rounded font-semibold flex items-center gap-1 text-black',
                    getChangeBadgeGradient(change)
                )}
            >
                <Icon className="w-4 h-4" />
                {`${change.toFixed(1)}%`}
            </span>
        );
    };

    return (
        <div>
            {/* Desktop Table */}
            <div className="hidden md:block">
                <Table className="w-full border-collapse">
                    <TableHeader>
                        <TableRow className="bg-muted/50">
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
                        {viewData.map((item, i) => (
                            <TableRow
                                key={item.department}
                                className={`transition-all duration-200 ${i % 2 === 0 ? 'bg-[hsl(var(--muted)/0.25)]' : ''
                                    } hover:shadow-md hover:bg-[hsl(var(--muted)/0.4)]`}
                            >
                                <TableCell className="border border-border px-3 py-2 font-medium text-wrap">{item.department}</TableCell>
                                <TableCell className="border border-border px-3 py-2 text-right font-semibold text-primary">
                                    ${item.prevAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                </TableCell>
                                <TableCell className="border border-border px-3 py-2 text-right font-semibold text-primary">
                                    ${item.amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                </TableCell>
                                <TableCell
                                    className={cn(
                                        'border border-border px-3 py-2 text-right font-semibold',
                                        item.change === 0
                                            ? 'text-muted-foreground'
                                            : item.change > 0
                                                ? 'text-green-500'
                                                : 'text-red-500'
                                    )}
                                >
                                    {item.change === 0 ? '—' : `${item.change.toFixed(1)}%`}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Cards */}
            <div className="space-y-4 md:hidden">
                {viewData.map((item) => (
                    <div key={item.department} className='border border-border rounded-md shadow-md overflow-hidden'
                    >
                        <ChangeDisplay change={item.change} />

                        <div className='p-4 bg-[hsl(var(--card))]'>
                            <p className='flex items-center gap-2 font-semibold text-foreground mb-2'>
                                <Boxes className='w-5 h-5 flex-shrink-0' />
                                {item.department}
                            </p>
                            <div className='flex justify-between gap-4 mb-2 items-center'>
                                <div className='flex flex-col gap-2 items-start'>
                                    <div>Last Month</div>
                                    <span
                                        className={'font-semibold flex items-center gap-1 text-primary'}
                                    >
                                        <DollarSign className='w-5 h-5 flex-shrink-0' />
                                        {item.prevAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    </span>
                                </div>
                                <div className='flex flex-col gap-2 items-end'>
                                    <div>This Month</div>
                                    <span
                                        className={'font-semibold flex items-center gap-1 text-primary'}
                                    >
                                        <DollarSign className='w-5 h-5 flex-shrink-0' />
                                        {item.amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div >
    );
}
