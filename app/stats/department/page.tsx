'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Store, Plus, LucideIcon, Calendar, DollarSign, Boxes, TrendingUp } from 'lucide-react';
import { DepartmentStatsSchema } from '@/types/type';
import { ComboBox } from '@/components/shared/combobox';
import { DatePicker } from '@/components/shared/date-picker';
import { useRouter } from 'next/navigation';
import DepartmentStatsView from '@/components/stats/department-stats-view';

// ---------------- Sample Options ----------------
const stores = [
    { id: 1, name: 'Freshmart A' },
    { id: 2, name: 'Freshmart B' },
    { id: 3, name: 'Freshmart C' },
];

const departmentsOptions = [
    { id: 1, name: 'Produce' },
    { id: 2, name: 'Dairy' },
    { id: 3, name: 'Meat' },
    { id: 4, name: 'Bakery' },
    { id: 5, name: 'Grocery' },
    { id: 6, name: 'Frozen' },
    { id: 7, name: 'Beverages' },
    { id: 8, name: 'Health & Beauty' },
    { id: 9, name: 'Household' },
    { id: 10, name: 'Floral' },
];

// 🧮 Example "last month" data (you'll replace with Supabase fetch later)
const lastMonthData: Record<string, number> = {
    Produce: 12000,
    Dairy: 8000,
    Meat: 10000,
    Bakery: 5000,
    Grocery: 15000,
    Frozen: 7000,
    Beverages: 6000,
    'Health & Beauty': 4000,
    Household: 5500,
    Floral: 2000,
};

type DepartmentStatsForm = z.infer<typeof DepartmentStatsSchema>;

export default function DepartmentStatsPage() {
    const [viewData, setViewData] = useState<
        { storeName: string; department: string; prevAmount: number, amount: number; change: number }[]
    >([]);
    
    const router = useRouter();

    const form = useForm<DepartmentStatsForm>({
        resolver: zodResolver(DepartmentStatsSchema),
        defaultValues: {
            storeName: '',
            monthYear: new Date(),
            departments: Array.from({ length: 10 }, () => ({
                department: '',
                amount: 0,
            })),
        },
    });

    const storeName = form.watch('storeName');

    const { fields, append } = useFieldArray({
        name: 'departments',
        control: form.control,
    });

    const handleAddMoreDepartmentRows = () => {
        append(
            Array.from({ length: 5 }, () => ({
                department: '',
                amount: 0,
            }))
        );
    };

    const onSubmit = (values: DepartmentStatsForm) => {
        const cleaned = values.departments.filter(
            (d) => d.department && d.amount > 0
        );

        // Include last month amount in computed data
        const computed = cleaned.map((item) => {
            const prevAmount = lastMonthData[item.department] ?? 0;
            const change = prevAmount === 0 ? 0 : ((item.amount - prevAmount) / prevAmount) * 100;
            return { ...item, prevAmount, change, storeName: values.storeName };
        });

        setViewData(computed);
        router.refresh();
        form.reset();
        console.log('Submitted:', computed);
    };

    function LabelWithIcon({
        icon: Icon,
        children,
    }: {
        icon: LucideIcon;
        children: React.ReactNode;
    }) {
        return (
            <FormLabel className='font-semibold text-base mb-2 flex items-center gap-2 text-primary'>
                <Icon className='w-5 h-5 text-primary flex-shrink-0' />
                {children}
            </FormLabel>
        );
    }

    return (
        <div className="p-6 bg-card text-card-foreground flex flex-col gap-8 rounded-xl border py-6 shadow-sm max-w-5xl mx-auto">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Store + MonthYear */}
                    <FormField
                        control={form.control}
                        name="storeName"
                        render={({ field }) => (
                            <FormItem className='flex flex-col'>
                                <LabelWithIcon icon={Store}>Store Name</LabelWithIcon>
                                <ComboBox
                                    options={stores}
                                    selectedValue={field.value}
                                    setValue={(value: string) => form.setValue(field.name, value)}
                                    placeholder='Select a store'
                                />
                                <FormMessage className='text-red-500 mt-1 text-sm' />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='monthYear'
                        render={({ field }) => (
                            <FormItem className='flex flex-col'>
                                <LabelWithIcon icon={Calendar}>
                                    Date to Withdraw
                                </LabelWithIcon>
                                <DatePicker
                                    placeholder='Select a date'
                                    selectedValue={field.value ?? new Date()}
                                    setValue={(value: Date) => field.onChange(value)}
                                    styles={{
                                        month_grid: { display: 'none' }
                                    }}
                                    formatType="MMMM yyyy"
                                />
                                <FormMessage className='text-red-500 mt-1 text-sm' />
                            </FormItem>
                        )}
                    />

                    {storeName &&
                        <div className="space-y-4">
                            {fields.map((row, index) => (
                                <div key={row.id} className="flex gap-4">
                                    {/* Department Field */}
                                    <FormField
                                        control={form.control}
                                        name={`departments.${index}.department`}
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col flex-1">
                                                <LabelWithIcon icon={Boxes}>Department</LabelWithIcon>
                                                <ComboBox
                                                    options={departmentsOptions}
                                                    selectedValue={field.value}
                                                    setValue={(value: string) => form.setValue(field.name, value)}
                                                    placeholder="Select a department"
                                                    canAddNewValues={true}
                                                />
                                                <FormMessage className='text-red-500 mt-1 text-sm' />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Amount Field */}
                                    <FormField
                                        control={form.control}
                                        name={`departments.${index}.amount`}
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col flex-1">
                                                <LabelWithIcon icon={DollarSign}>Amount</LabelWithIcon>
                                                <Input
                                                    {...field}
                                                    value={field.value === 0 ? '' : field.value}
                                                    type="number"
                                                    placeholder="Enter amount"
                                                    className="text-base focus:ring-2 focus:ring-primary w-full"
                                                    step="0.01"
                                                    onChange={(e) => {
                                                        const el = e.target;
                                                        const next = el.value === '' ? undefined : el.valueAsNumber;
                                                        field.onChange(Number.isNaN(next) ? undefined : next);
                                                    }}
                                                />
                                                <FormMessage className='text-red-500 mt-1 text-sm' />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            ))}
                        </div>
                    }
                    {/* Add Rows + Submit */}
                    <div className="flex justify-between items-center mt-6">
                        <Button
                            type="button"
                            variant="secondary"
                            className="flex items-center gap-2"
                            onClick={handleAddMoreDepartmentRows}
                        >
                            <Plus className='w-5 h-5 text-primary flex-shrink-0' /> Add 5 More
                        </Button>

                        <Button type="submit" className="bg-primary text-primary-foreground">
                            Submit Stats
                        </Button>
                    </div>
                </form>
            </Form>

            {/* ---- VIEW SECTION ---- */}
            {viewData.length > 0 && (
                <Card className="mt-8 border border-border/40 shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg text-primary">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            Department Stats Overview For {viewData[0].storeName}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DepartmentStatsView viewData={viewData} />
                    </CardContent>

                </Card>
            )}
        </div>
    );
}
