'use client';
import {
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid,
    ScatterChart,
    Scatter,
} from 'recharts';
import { useMemo, useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';

interface DepartmentHeatmapProps {
    data: {
        department_name: string;
        month: string; // 'YYYY-MM'
        amount: number;
    }[];
}

export function DepartmentHeatmap({ data }: DepartmentHeatmapProps) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Unique months sorted chronologically
    const months = useMemo(() => {
        const unique = Array.from(new Set(data.map((d) => d.month)));
        return unique.sort();
    }, [data]);

    const displayMonths = useMemo(() => {
        if (isMobile) return months.slice(-3); // show last 3 months on mobile
        return months;
    }, [months, isMobile]);

    // Unique departments sorted alphabetically
    const departments = useMemo(() => {
        return Array.from(new Set(data.map((d) => d.department_name))).sort();
    }, [data]);

    // Build grid points for the heatmap
    const gridData = useMemo(() => {
        return departments.flatMap((dep, yIndex) =>
            displayMonths.map((month, xIndex) => {
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
    }, [departments, displayMonths, data]);

    const fullGridData = useMemo(() => {
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

    // Normalize color intensity
    const maxAmount = Math.max(...gridData.map((d) => d.amount), ...fullGridData.map(d => d.amount));
    const colorScale = (value: number) => {
        if (value <= 0) return 'hsl(0, 0%, 90%)'; // light gray
        const intensity = Math.min(1, value / maxAmount);
        const hue = 0 + intensity * 120; // red -> green
        return `hsl(${hue}, 70%, 50%)`;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const renderScatterShape = (props: any) => {
        const size = 10;
        return (
            <rect
                x={props.cx - size / 2}
                y={props.cy - size / 2}
                width={size}
                height={size}
                fill={colorScale(props.payload.amount)}
                strokeWidth={1}
                cursor="pointer"
            />
        );
    };

    return (
        <div className="flex flex-col w-full h-full">
            <ResponsiveContainer width="100%" height={Math.max(300, departments.length * 35)}>
                <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
                    <XAxis
                        dataKey="x"
                        type="number"
                        domain={[0, displayMonths.length - 1]}
                        ticks={displayMonths.map((_, i) => i)}
                        tick={({ x, y, payload }) => {
                            const month = displayMonths[payload.value];
                            return (
                                <text
                                    x={x}
                                    y={y + 10}
                                    textAnchor="end"
                                    fill="hsl(var(--foreground))"
                                    fontSize={10}
                                    transform={`rotate(-45, ${x}, ${y + 10})`}
                                >
                                    {format(parseISO(month), 'MMM yy')}
                                </text>
                            );
                        }}
                        interval={0}
                        height={50}
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
                                        <div className="font-medium text-foreground">{d.department}</div>
                                        <div>{format(parseISO(d.month), 'MMMM yyyy')}</div>
                                        <div className="text-muted-foreground">${d.amount.toLocaleString()}</div>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Scatter data={gridData} shape={renderScatterShape} />
                </ScatterChart>
            </ResponsiveContainer>

            {/* Legend with amounts */}
            <div className="flex items-center justify-between gap-2 w-full px-4">
                <div className="flex flex-col items-start text-xs">
                    <span>Low</span>
                    <span>${0}</span>
                </div>
                <div className="flex-1 h-3 rounded overflow-hidden mx-2">
                    <div
                        style={{
                            background: 'linear-gradient(to right, hsl(0,70%,50%), hsl(120,70%,50%))',
                            width: '100%',
                            height: '100%',
                        }}
                    />
                </div>
                <div className="flex flex-col items-end text-xs">
                    <span>High</span>
                    <span>${maxAmount.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
}
