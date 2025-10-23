import { createClient as createServerClient } from '@/lib/supabase/server';
import DashboardClient from './pageClient';
import { getDashboardData } from '@/lib/api/dashboard';

export default async function DashboardPage() {
  // 1️⃣ Get user + other global info
  const supabase = await createServerClient();

  // Minimal auth lookup
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 2️⃣ Fetch dashboard data server-side using cached call
  const dashboardData = await getDashboardData(user?.id || '');

  // 3️⃣ Pass both to client component for rendering
  return <DashboardClient dashboardData={dashboardData} />;
}
