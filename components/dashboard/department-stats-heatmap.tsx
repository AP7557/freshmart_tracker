'use client';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    Cell,
    CartesianGrid,
    ScatterChart,
    Scatter,
} from 'recharts';
import { useMemo, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

interface DepartmentHeatmapProps {
    data: {
        department_name: string;
        month: string; // 'YYYY-MM'
        amount: number;
    }[];
}

export function DepartmentHeatmap({ data }: DepartmentHeatmapProps) {
    const [activeCell, setActiveCell] = useState<any>(null);

    // Unique months sorted chronologically
    const months = useMemo(() => {
        const unique = Array.from(new Set(data.map((d) => d.month)));
        return unique.sort();
    }, [data]);

    // Unique departments sorted alphabetically
    const departments = useMemo(() => {
        return Array.from(new Set(data.map((d) => d.department_name))).sort();
    }, [data]);

    // Build grid points for the heatmap
    const gridData = useMemo(() => {
        return departments.flatMap((dep, yIndex) =>
            months.map((month, xIndex) => {
                const item = data.find(
                    (d) => d.department_name === dep && d.month === month
                );
                return {
                    x: xIndex,
                    y: yIndex,
                    month,
                    department: dep,
                    amount: item?.amount ?? 0,
                };
            })
        );
    }, [departments, months, data]);

    // Normalize color intensity based on max amount
    const maxAmount = Math.max(...gridData.map((d) => d.amount));
    const colorScale = (value: number) => {
        if (value <= 0) return 'hsl(0, 0%, 90%)'; // light gray for 0
        const intensity = Math.min(1, value / maxAmount);
        const hue = 0 + intensity * 120; // 0 = red, 120 = green
        return `hsl(${hue}, 70%, 50%)`;
    };

    return (
        <Card className="w-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">
                    Department Trend Heatmap
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                    Color intensity represents monthly sales trend per department
                </p>
            </CardHeader>

            <CardContent>
                <div className="w-full h-[500px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart
                            margin={{
                                top: 20,
                                right: 20,
                                bottom: 0,
                                left: 0,
                            }}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
                            <XAxis
                                dataKey="x"
                                type="number"
                                domain={[0, months.length - 1]}
                                ticks={months.map((_, i) => i)}
                                tickFormatter={(x) =>
                                    format(parseISO(months[x]), 'MMM yy')
                                }
                                tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                                interval={0}
                            />

                            <YAxis
                                dataKey="y"
                                type="number"
                                domain={[0, departments.length - 1]}
                                ticks={departments.map((_, i) => i)}
                                tickFormatter={(y) => departments[y]}
                                tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                                width={120}
                            />

                            <Tooltip
                                cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const d = payload[0].payload;
                                        return (
                                            <div className="rounded-md bg-popover px-3 py-2 shadow border text-sm space-y-1">
                                                <div className="font-medium text-foreground">
                                                    {d.department}
                                                </div>
                                                <div>{format(parseISO(d.month), 'MMMM yyyy')}</div>
                                                <div className="text-muted-foreground">
                                                    ${d.amount.toLocaleString()}
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Scatter data={gridData} shape="square">
                                {gridData.map((d, i) => (
                                    <Cell
                                        key={i}
                                        cursor="pointer"
                                        fill={colorScale(d.amount)}
                                        onClick={() => setActiveCell(d)}
                                    />
                                ))}
                            </Scatter>
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>

                {activeCell && (
                    <div className="mt-6 text-center text-sm">
                        <div className="font-medium text-foreground">
                            {activeCell.department} —{' '}
                            {format(parseISO(activeCell.month), 'MMMM yyyy')}
                        </div>
                        <div className="text-muted-foreground">
                            Amount: ${activeCell.amount.toLocaleString()}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
