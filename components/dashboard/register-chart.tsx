'use client';

import {
  Bar,
  BarChart,
  XAxis,
  CartesianGrid,
  ResponsiveContainer,
  YAxis,
} from 'recharts';
import {
  ChartContainer,
  ChartConfig,
  ChartTooltipContent,
  ChartLegendContent,
  ChartTooltip,
  ChartLegend,
} from '@/components/ui/chart';
import { formatMoney } from '@/lib/utils/format-number';

export default function RegisterOverviewChart({
  registerStats,
}: {
  registerStats: { week: string; business: number; payout: number }[];
}) {
  const chartConfig: ChartConfig = {
    business: { label: 'Business', color: 'hsl(var(--chart-2))' },
    payout: {
      label: 'Payout',
      color: 'hsl(var(--chart-3))',
    },
  };

  return (
    <ChartContainer config={chartConfig} className='h-[500px] w-full'>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart data={registerStats} barSize={10}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey='week'
            angle={-45}
            textAnchor='end'
            height={100} // prevent overflow
          />
          <YAxis />

          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value, name) => (
                  <div
                    className='flex gap-3'
                    style={{ color: `var(--color-${name})` }}
                  >
                    <div className='flex-wrap capitalize'>{name}:</div>
                    <div>${formatMoney(Number(value))}</div>
                  </div>
                )}
              />
            }
          />
          <ChartLegend content={<ChartLegendContent />} />

          <Bar
            dataKey='business'
            fill='var(--color-business)'
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey='payout'
            radius={[4, 4, 0, 0]}
            fill='var(--color-payout)'
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
