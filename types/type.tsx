import z from 'zod';

export type OptionsType = { id: number; name: string }[];

export type FuturePaymentsType = {
  company_name: string;
  amount: number;
  date_to_withdraw?: Date;
  check_number?: number;
}[];

type PayoutsType = {
  company_name: string;
  amount: number;
  check_number?: number;
  date_to_withdraw?: Date;
  type_name: string;
  invoice_number: string;
};

export interface AllPayoutsType extends PayoutsType {
  created_at: Date;
  company_id: number;
  type_id: number;
}

export interface PostedPayoutsType extends PayoutsType {
  id: number;
  is_check_deposited?: boolean;
  created_at: Date;
}

export interface TodaysPayoutsType extends PayoutsType {
  id: number;
  store_name: string;
}

export type UserTimeLog = {
  id: number;
  finger_id: number;
  store_id: number;
  action: string;
  timestamp_utc: string;
  name: string;
};

type Shift = {
  in: string;
  out: string;
  minutes: number;
};

type UserDay = {
  date: string;
  shifts: Shift[];
};

export type UserWeek = {
  finger_id: number;
  name: string;
  totalMinutes: number;
  days: Record<string, UserDay>;
};

export type DeviceStatus = {
  pending_count: number;
  last_seen: string;
  status: string;
}

export const FormSchema = z
  .object({
    storeName: z.string().nonempty('Store name is required'),
    companyName: z.string().nonempty('Company name is required'),
    type: z.string().nonempty('Type is required'),
    amount: z
      .number()
      .refine(
        (val) => /^\d+(\.\d{1,2})?$/.test(String(val)),
        'Amount must have up to 2 decimal places and not contain negative sign'
      ),
    invoiceNumber: z.string().nonempty('Invoice number is required'),
    checkNumber: z.number().int().positive().optional(),
    dateToWithdraw: z.date().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === 'Check Payment' && data.checkNumber === undefined) {
      ctx.addIssue({
        code: 'custom',
        message: 'Check number is required for Check Payment',
        path: ['checkNumber'],
      });
    }
    if (data.type === 'ACH Payment' && data.dateToWithdraw === undefined) {
      ctx.addIssue({
        code: 'custom',
        message: 'Deposit date is required for ACH Payment',
        path: ['dateToWithdraw'],
      });
    }
  });

export const DepartmentStatsSchema = z.object({
  storeName: z.string().min(1, 'Store is required'),
  monthYear: z.date(),
  departments: z
    .array(
      z
        .object({
          department: z.string(),
          amount: z
            .number()
            .refine(
              (val) =>
                val === undefined ||
                (/^\d+(\.\d{1,2})?$/.test(String(val)) && val >= 0),
              'Amount must be a non-negative number with up to 2 decimal places'
            ),
        })
        .refine(
          (data) =>
            // If department has value, amount must be filled (> 0)
            !data.department || (data.amount !== undefined && data.amount > 0),
          {
            message: 'Amount is required when department is filled',
            path: ['amount'],
          }
        )
        .refine(
          (data) =>
            // If amount > 0, department must be filled
            !data.amount || data.department,
          {
            message: 'Department is required when amount is filled',
            path: ['department'],
          }
        )
    )
    .min(1, 'At least one department required')
    .refine(
      (arr) => arr.some((d) => d.department || (d.amount && d.amount > 0)),
      'At least one department entry must have valid data'
    ),
});
