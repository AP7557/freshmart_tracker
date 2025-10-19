import { createClient } from '@/lib/supabase/client';
import { OptionsType } from '../types/type';

type PayoutsType = {
  invoice_number: string;
  amount: number;
  check_number?: number;
  date_to_withdraw?: Date;
  company: { name: string };
  type: { name: string };
};

interface GetTodaysPayoutsType extends PayoutsType {
  id: number;
}

interface GetPayoutsToPostType extends PayoutsType {
  id: number;
  is_check_deposited: boolean;
  created_at: Date;
}

type GetAllUsersType = {
  user_name: string;
  id: string;
  user_email: string;
  role: 'user' | 'manager' | 'admin';
  user_stores: { stores: { id: number; name: string } }[];
};

export const getTodaysPayouts = async (
  storeOptions: OptionsType,
  storeName: string
) => {
  const storeId = storeOptions.find((store) => store.name === storeName)?.id;
  const supabase = createClient();

  // Get today's date in local time
  const now = new Date();
  const startOfDayLocal = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0
  );
  const endOfDayLocal = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999
  );

  // Convert to UTC
  const startOfDayUTC = new Date(
    startOfDayLocal.getTime() - startOfDayLocal.getTimezoneOffset() * 60000
  );
  const endOfDayUTC = new Date(
    endOfDayLocal.getTime() - endOfDayLocal.getTimezoneOffset() * 60000
  );

  const { data, error } = await supabase
    .from('payouts')
    .select(
      `
    id,
    invoice_number,
    amount,
    check_number,
    date_to_withdraw,
    company:companies(name),
    type:types(name)
  `
    )
    .eq('store_id', storeId)
    .gte('created_at', startOfDayUTC.toISOString())
    .lte('created_at', endOfDayUTC.toISOString())
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error Getting Today's Payouts", error);
    return;
  }

  const payoutData = (data as unknown as GetTodaysPayoutsType[]).map((p) => ({
    id: p.id,
    invoice_number: p.invoice_number,
    amount: p.amount,
    check_number: p.check_number,
    date_to_withdraw: p.date_to_withdraw,
    company_name: p.company.name,
    type_name: p.type.name,
    store_name: storeName,
  }));

  return { payoutData };
};

export const addPayouts = async (values: {
  companyName: string;
  storeName: string;
  type: string;
  amount: number;
  invoiceNumber: string;
  checkNumber?: number;
  dateToWithdraw?: Date;
}) => {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const email = session?.user?.email ?? null;

  const { data, error } = await supabase.rpc('insert_payout', {
    p_company_name: values.companyName,
    p_store_name: values.storeName,
    p_user_email: email,
    p_type_name: values.type,
    p_amount: values.amount,
    p_invoice_number: values.invoiceNumber,
    p_check_number: values.checkNumber ?? null,
    p_date_to_withdraw: values.dateToWithdraw ?? null,
  });

  if (error) {
    console.error('Error Adding Payouts', error);
    return;
  }

  return { data };
};

export const addDepartmentStats = async (values: {
  storeName: string;
  monthYear: Date;
  departments: {
    department: string;
    amount: number;
  }[]
}) => {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('insert_department_stats', {
    p_store_name: values.storeName,
    p_date: values.monthYear,
    p_departments: values.departments,
  });

  if (error) {
    console.error('Error Adding Payouts', error);
    return;
  }

  return { data };
};

export const getStoresForUser = async () => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('user_stores')
    .select(
      `
    store:stores (
      id,
      name
    )
  `
    )
    .eq('user_id', user?.id);

  if (error) {
    console.error('Error Getting Accessed Store for User', error);
    return;
  }

  let stores: OptionsType = [];
  stores = data.flatMap((item) => item.store);

  return { stores };
};

export const getDepartmentStatsForHeatMap = async (storeId: number) => {
  const supabase = createClient();

  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  oneYearAgo.setMonth(0, 1); // Start from Jan of last year

  const { data, error } = await supabase
    .from('department_stats')
    .select(`
      amount,
      date,
      departments(name)
    `)
    .eq('store_id', storeId)
    .gte('date', oneYearAgo.toISOString().split('T')[0])
    .order('date', { ascending: true });
  if (error) {
    console.error('Error fetching department trends:', error);
    throw error;
  }

  return (data as unknown as { amount: number; date: string; departments: { name: string } }[]).map((d) => ({
    amount: Number(d.amount),
    month: d.date,
    department_name: d.departments.name,
  })) ?? [];
}

export const getCompanies = async () => {
  const supabase = createClient();

  const { data, error } = await supabase.from('companies').select('*');

  if (error) {
    console.error('Error Getting Companies', error);
    return;
  }

  return { companies: data };
};

export const getTypes = async () => {
  const supabase = createClient();

  const { data, error } = await supabase.from('types').select('*');

  if (error) {
    console.error('Error Getting Types', error);
    return;
  }

  return { types: data };
};

export const getDepartments = async () => {
  const supabase = createClient();

  const { data, error } = await supabase.from('departments').select('*');

  if (error) {
    console.error('Error Getting Departments', error);
    return;
  }

  return { departments: data };
};

export const getPayoutsToPost = async (
  storeOptions: OptionsType,
  storeName: string
) => {
  const storeId = storeOptions.find((store) => store.name === storeName)?.id;
  const supabase = createClient();

  const { data, error } = await supabase
    .from('payouts')
    .select(
      `
      id,
      invoice_number,
    amount,
    check_number,
    date_to_withdraw,
    is_check_deposited,
    company:companies(name),
    type:types(name),
    created_at
    `
    )
    .eq('store_id', storeId)
    .or(
      `date_to_withdraw.gte.${new Date().toISOString().split('T')[0]
      },and(check_number.not.is.null,is_check_deposited.eq.false)`
    );

  if (error) {
    console.error('Error Getting Payouts to Post', error);
    return;
  }

  let payoutData;

  const sortedPayouts = (data as unknown as GetPayoutsToPostType[]).sort(
    (a, b) => {
      // Check Payments first
      if (a.check_number && b.check_number)
        return a.check_number - b.check_number;
      if (a.check_number) return -1;
      if (b.check_number) return 1;

      // ACH Payments at bottom by date
      if (a.date_to_withdraw && b.date_to_withdraw)
        return (
          new Date(a.date_to_withdraw).getTime() -
          new Date(b.date_to_withdraw).getTime()
        );
      if (a.date_to_withdraw) return 1;
      if (b.date_to_withdraw) return -1;

      return 0;
    }
  );

  payoutData = sortedPayouts.map((p) => ({
    id: p.id,
    invoice_number: p.invoice_number,
    amount: p.amount,
    check_number: p.check_number,
    date_to_withdraw: p.date_to_withdraw,
    is_check_deposited: p.is_check_deposited,
    company_name: p.company.name,
    type_name: p.type.name,
    created_at: p.created_at,
  }));

  return { payoutData };
};

export const updatePayouts = async (payoutId: number) => {
  const supabase = createClient();

  const { error } = await supabase
    .from('payouts')
    .update({ is_check_deposited: true })
    .eq('id', payoutId);

  if (error) {
    console.error('Error Updating Payout', error);
  }

  return { error };
};

export const getDashboardData = async () => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase.rpc('get_dashboard_totals', {
    p_user_id: user?.id,
  });

  if (error) {
    console.error('get_dashboard_data rpc error', error);
    throw error;
  }

  // data should be an array of rows
  return data;
};

export const getStorePayoutDetails = async (storeId: number) => {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('get_store_payout_details', {
    p_store_id: storeId,
  });

  if (error) {
    console.error(error);
    return null;
  }

  let result = data as any;
  if (typeof result === 'string') result = JSON.parse(result);

  return {
    store_name: result.store_name,
    allPayouts: result.all_payouts,
    companyTotals: result.company_totals,
    futurePayments: result.future_payments,
  };
};

export const getAllStores = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.from('stores').select('*');

  if (error) {
    console.error('Error Getting All Stores', error);
    return;
  }

  return { allStoresData: data };
};

export const getAllUsers = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.from('users').select(`
     id,
      user_name,
      user_email,
      role,
      user_stores (
        stores ( id, name )
      )
    `);

  const users = (data as unknown as GetAllUsersType[])?.map((user) => ({
    id: user.id,
    name: user.user_name,
    email: user.user_email,
    role: user.role,
    stores: user.user_stores.map((us) => ({
      id: us.stores.id,
      name: us.stores.name,
    })),
  }));

  if (error) {
    console.error('Error Getting All Users', error);
    return;
  }

  return { usersData: users };
};

export const updateUserRole = async (
  userId: string,
  newRole: 'user' | 'manager' | 'admin'
) => {
  const supabase = createClient();

  const { error } = await supabase
    .from('users')
    .update({ role: newRole })
    .eq('id', userId);

  if (error) {
    console.error('Error Updating User Role', error);
  }

  return { error };
};

export const updateUserStores = async (
  userId: string,
  storeId: number,
  shouldRemove: boolean
) => {
  const supabase = createClient();

  if (shouldRemove) {
    const { error } = await supabase
      .from('user_stores')
      .delete()
      .eq('user_id', userId)
      .eq('store_id', storeId);

    if (error) {
      console.error('Error Removing Store for User', error);
    }
    return { error };
  }

  const { error } = await supabase.from('user_stores').insert({
    user_id: userId,
    store_id: storeId,
  });

  if (error) {
    console.error('Error Adding Store for User', error);
  }
  return { error };
};

export const getUserRole = async () => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', user?.id);

  if (error) {
    console.error('Error Getting User Role', error);
    return;
  }

  return { data };
};
