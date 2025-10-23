'use client';

import * as React from 'react';
import { useMemo, useState } from 'react';
import { format, parseISO } from 'date-fns';
import {
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { MultiSelectComboBox } from './combobox-multiselect';
import DepartmentStatsView from '../stats/department-stats-view';
import { ComboBox } from '../shared/combobox';
import { Button } from '../ui/button';

interface DepartmentComparisonProps {
  departmentStats: {
    department_name: string;
    month: string;
    amount: number;
  }[];
}

type StatsData = {
  department_name: string;
  previous_amount: number;
  current_amount: number;
  percent_change: number;
};

type ModeType = 'Amount' | 'Percent Change';
type TopBottomType = 'Top' | 'Bottom';

// Generate colors for departments
const generateColors = (count: number) =>
  Array.from(
    { length: count },
    (_, i) => `hsl(${(i * 360) / count}, 70%, 50%)`
  );

export function DepartmentComparisonChart({
  departmentStats,
}: DepartmentComparisonProps) {
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [modeFilter, setModeFilter] = useState<ModeType>('Amount');
  const [topBottomFilter, setTopBottomFilter] = useState<TopBottomType>('Top');
  const topCount = 10;

  // Department options for multi-select
  const departmentOptions = useMemo(
    () =>
      Array.from(new Set(departmentStats.map((d) => d.department_name))).map(
        (name, i) => ({ id: i + 1, name })
      ),
    [departmentStats]
  );

  const months = Array.from(new Set(departmentStats.map((d) => d.month))).sort(
    (a, b) => parseISO(a).getTime() - parseISO(b).getTime()
  );

  // Departments to display
  const statsViewData = useMemo(() => {
    const latestMonth = months.at(-1)!;
    const prevMonth = months.length > 1 ? months[months.length - 2] : null;

    const stats: StatsData[] = departmentStats
      .filter((d) => d.month === latestMonth)
      .map((d) => {
        const prevAmount = prevMonth
          ? departmentStats.find(
              (x) =>
                x.department_name === d.department_name && x.month === prevMonth
            )?.amount ?? 0
          : 0;
        const percent_change = prevAmount
          ? ((d.amount - prevAmount) / prevAmount) * 100
          : 0;

        return {
          department_name: d.department_name,
          previous_amount: prevAmount,
          current_amount: d.amount,
          percent_change,
        };
      });

    // If departments are selected, show those; otherwise, apply top/bottom slicing
    let filteredStats: StatsData[];
    if (selectedDepartments.length > 0) {
      filteredStats = stats.filter((d) =>
        selectedDepartments.includes(d.department_name)
      );
    } else {
      const sortedByMode = stats.sort((a, b) =>
        modeFilter === 'Amount'
          ? b.current_amount - a.current_amount
          : b.percent_change - a.percent_change
      );

      filteredStats =
        topBottomFilter === 'Top'
          ? sortedByMode.slice(0, topCount)
          : sortedByMode.slice(-topCount).reverse();
    }

    return filteredStats;
  }, [
    departmentStats,
    months,
    modeFilter,
    topBottomFilter,
    selectedDepartments,
  ]);

  const visibleDepartments = statsViewData.map((d) => d.department_name);

  const chartData = months.map((month) => {
    const record: Record<string, number | string> = {
      month: format(parseISO(month), 'MMM yy'),
    };
    visibleDepartments.forEach((dep) => {
      record[dep] =
        departmentStats.find(
          (d) => d.department_name === dep && d.month === month
        )?.amount ?? 0;
    });
    return record;
  });

  const depColors = Object.fromEntries(
    visibleDepartments.map((dep, i) => [
      dep,
      generateColors(visibleDepartments.length)[i],
    ])
  );

  return (
    <div className='flex flex-col gap-6 w-full'>
      <MultiSelectComboBox
        selectedValue={selectedDepartments}
        placeholder={`Select Departments (Def: T/B ${topCount})`}
        options={departmentOptions}
        setValue={(value) =>
          setSelectedDepartments((prev) =>
            prev.includes(value)
              ? prev.filter((v) => v !== value)
              : [...prev, value]
          )
        }
      />
      {selectedDepartments.length === 0 && (
        <div className='flex flex-col md:flex-row gap-2'>
          <div className='w-full'>
            <ComboBox
              selectedValue={modeFilter}
              placeholder='Mode'
              options={[
                { id: 1, name: 'Amount' },
                { id: 2, name: 'Percent Change' },
              ]}
              setValue={(val) => setModeFilter(val as ModeType)}
            />
          </div>
          <div className='w-full'>
            <ComboBox
              selectedValue={topBottomFilter}
              placeholder='Type'
              options={[
                { id: 1, name: 'Top' },
                { id: 2, name: 'Bottom' },
              ]}
              setValue={(val) => setTopBottomFilter(val as TopBottomType)}
            />
          </div>
        </div>
      )}
      <div className='flex justify-end'>
        <Button
          variant='secondary'
          className='text-primary'
          onClick={() => {
            setSelectedDepartments([]);
          }}
        >
          Clear Department
        </Button>
      </div>

      <ChartContainer
        id='department-comparison'
        config={Object.fromEntries(
          visibleDepartments.map((dep) => [dep, { color: depColors[dep] }])
        )}
        className='w-full h-[500px]'
      >
        <LineChart data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey='month' />
          <YAxis />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value, name) => (
                  <div
                    style={{ color: depColors[name] || 'inherit' }}
                    className='flex gap-3'
                  >
                    <div className='flex-wrap'>{name}:</div>
                    <div>{value}</div>
                  </div>
                )}
              />
            }
          />
          <ChartLegend />
          {visibleDepartments.map((dep) => (
            <Line
              key={dep}
              type='monotone'
              dataKey={dep}
              stroke={depColors[dep]}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ChartContainer>

      <DepartmentStatsView viewData={statsViewData} />
    </div>
  );
}
