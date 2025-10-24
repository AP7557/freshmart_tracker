'use client';

import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Store, Plus, Calendar, DollarSign, Boxes, TrendingUp } from 'lucide-react';
import { DepartmentStatsSchema, OptionsType } from '@/types/type';
import { ComboBox } from '@/components/shared/combobox';
import { DatePicker } from '@/components/shared/date-picker';
import { useRouter } from 'next/navigation';
import DepartmentStatsView from '@/components/stats/department-stats-view';
import { LabelWithIcon } from '@/components/shared/label-with-icon';
import { addDepartmentStats, getDepartments, getStoresForUser } from '@/db/db-calls';

type DepartmentStatsForm = z.infer<typeof DepartmentStatsSchema>;

export default function DepartmentStatsPage() {
    const [loading, setLoading] = useState(false)
    const [viewData, setViewData] = useState<
        {
            current_amount: number
            department_name: string
            percent_change: number
            previous_amount: number
            report_date: Date
            store_name: string
        }[]
    >([]);
    const [storeOptions, setStoreOptions] = useState<OptionsType>([]);
    const [departmentOptions, setDepartmentOptions] = useState<OptionsType>([]);
    const todaysDate = new Date();
    const router = useRouter();

    const form = useForm<DepartmentStatsForm>({
        resolver: zodResolver(DepartmentStatsSchema),
        defaultValues: {
            storeName: '',
            monthYear: new Date(todaysDate.getFullYear(), todaysDate.getMonth(), 1),
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

    const onSubmit = async (values: DepartmentStatsForm) => {
        setLoading(true);

        const cleaned = values.departments.filter(
            (d) => d.department && d.amount > 0
        );

        const departmentStatsData = await addDepartmentStats({
            storeName: values.storeName,
            monthYear: values.monthYear,
            departments: cleaned
        })

        if (departmentStatsData?.data) {
            router.refresh();
            form.reset();
            setViewData(departmentStatsData.data)
        }

        setLoading(false);
    };

    useEffect(() => {
        (async () => {
            const storesForUser = await getStoresForUser();
            if (storesForUser?.stores) setStoreOptions(storesForUser.stores);

            const departmentsData = await getDepartments();
            if (departmentsData?.departments) setDepartmentOptions(departmentsData.departments);
        })();
    }, []);

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
                                    options={storeOptions}
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
                                                    options={departmentOptions}
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

                        <Button type="submit"
                            disabled={loading}
                            className="bg-primary text-primary-foreground">
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
                            Department Stats Overview For {viewData[0].store_name}
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
