'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { ComboBox } from '@/components/vendor/combobox';
import { MonthYearPicker } from '@/components/stats/month-year-picker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Store, Plus, LucideIcon, Calendar, DollarSign, Building, Boxes } from 'lucide-react';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { DatePicker } from '@/components/vendor/date-picker';
import { Input } from '@/components/ui/input';

// ---------------- Zod Schema ----------------
const DepartmentStatsSchema = z.object({
    storeName: z.string().min(1, "Store is required"),
    monthYear: z.date(),
    departments: z
        .array(
            z
                .object({
                    department: z.string(),
                    amount: z
                        .number()
                        .optional()
                        .refine(
                            (val) =>
                                val === undefined ||
                                (/^\d+(\.\d{1,2})?$/.test(String(val)) && val >= 0),
                            "Amount must be a non-negative number with up to 2 decimal places"
                        ),
                })
                .refine(
                    (data) =>
                        // If department has value, amount must be filled (> 0)
                        !data.department || (data.amount !== undefined && data.amount > 0),
                    { message: "Amount is required when department is filled", path: ["amount"] }
                )
                .refine(
                    (data) =>
                        // If amount > 0, department must be filled
                        !data.amount || data.department,
                    { message: "Department is required when amount is filled", path: ["department"] }
                )
        )
        .min(1, "At least one department required")
        .refine(
            (arr) => arr.some((d) => d.department || (d.amount && d.amount > 0)),
            "At least one department entry must have valid data"
        ),
});

type DepartmentStatsForm = z.infer<typeof DepartmentStatsSchema>;

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
        const cleanedData = values.departments.filter(
            (d) => d.department || (d.amount && d.amount > 0)
        );
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
                            onClick={handleAddRows}
                        >
                            <Plus className='w-5 h-5 text-primary flex-shrink-0' /> Add 5 More
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
