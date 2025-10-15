'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { ComboBox } from '@/components/vendor/combobox';
import { MonthYearPicker } from '@/components/stats/month-year-picker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Store, Plus, LucideIcon, Calendar } from 'lucide-react';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { DatePicker } from '@/components/vendor/date-picker';

// ---------------- Zod Schema ----------------
const DepartmentStatsSchema = z.object({
    storeName: z.string().min(1, 'Store is required'),
    monthYear: z.date(),
    departments: z
        .array(
            z.object({
                department: z.string().min(1, 'Department required'),
                amount: z
                    .number({ invalid_type_error: 'Amount must be a number' })
                    .min(0, 'Amount must be positive'),
            })
        )
        .min(1, 'At least one department required'),
});

type DepartmentStatsForm = z.infer<typeof DepartmentStatsSchema>;

// ---------------- Sample Options ----------------
const stores = [
    { id: 1, name: 'Freshmart A' },
    { id: 2, name: 'Freshmart B' },
    { id: 3, name: 'Freshmart C' },
];

const departmentsOptions = [
    'Produce',
    'Dairy',
    'Meat',
    'Bakery',
    'Grocery',
    'Frozen',
    'Beverages',
    'Health & Beauty',
    'Household',
    'Floral',
];

// ---------------- Component ----------------
export default function DepartmentStatsPage() {
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

    const handleAddRows = () => {
        append(
            Array.from({ length: 5 }, () => ({
                department: '',
                amount: 0,
            }))
        );
    };

    const onSubmit = (values: DepartmentStatsForm) => {
        console.log(values);
        // TODO: send to backend or Supabase
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
        <div className="p-6 bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm max-w-5xl mx-auto">
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

                    {/* <FormField
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
                                        month_grid: { display: 'none' } // remove the dot, use the key as in DayPicker
                                    }}
                                    formatType="MMMM yyyy"
                                />
                                <FormMessage className='text-red-500 mt-1 text-sm' />
                            </FormItem>
                        )}
                    /> */}

                    <FormField
                        control={form.control}
                        name="monthYear"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Month & Year</FormLabel>
                                <MonthYearPicker
                                    selectedValue={field.value ?? new Date()}
                                    setValue={(value: Date) => field.onChange(value)}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {storeName &&
                        < div className="space-y-4">
                            {fields.map((row, index) => (
                                <div key={row.id} className="flex gap-4 items-center">
                                    <FormField
                                        control={form.control}
                                        name={`departments.${index}.department`}
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormLabel>Department</FormLabel>
                                                <ComboBox
                                                    options={departmentsOptions}
                                                    selectedValue={field.value}
                                                    setValue={(v) => field.onChange(v)}
                                                    placeholder="Select department"
                                                />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`departments.${index}.amount`}
                                        render={({ field }) => (
                                            <FormItem className="w-32">
                                                <FormLabel>Amount</FormLabel>
                                                <input
                                                    type="number"
                                                    {...field}
                                                    className="w-full border rounded px-2 py-1 focus:ring-2 focus:ring-primary"
                                                    placeholder="0.00"
                                                    step={0.01}
                                                />
                                                <FormMessage />
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
                            onClick={handleAddRows}
                        >
                            <Plus className="w-4 h-4" /> Add 5 More
                        </Button>

                        <Button type="submit" className="bg-primary text-primary-foreground">
                            Submit Stats
                        </Button>
                    </div>
                </form>
            </Form>
        </div >
    );
}
