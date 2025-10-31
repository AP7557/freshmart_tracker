type DeptStat = {
  amount: number;
  date: string | Date;
  department_name: string;
  store_name: string;
};

type DeptChangeView = {
  current_amount: number;
  previous_amount: number;
  percent_change: number;
  department_name: string;
  store_name: string;
};

export const getDeptPercentChanges = (data: DeptStat[]): DeptChangeView[] => {
  if (!data?.length) return [];

  // Normalize dates
  const formatted = data.map((d) => ({
    ...d,
    date: new Date(d.date),
  }));

  // Identify unique months (latest → oldest)
  const months = Array.from(
    new Set(formatted.map((d) => d.date.toISOString().slice(0, 7)))
  ).sort((a, b) => (a < b ? 1 : -1)); // e.g. ['2025-09', '2025-08']

  const currentMonth = months[0];
  const previousMonth = months[1] ?? null;

  // Group by department for each month
  const currentMap = new Map<string, number>();
  const previousMap = new Map<string, number>();

  formatted.forEach((d) => {
    const monthKey = d.date.toISOString().slice(0, 7);
    if (monthKey === currentMonth) {
      currentMap.set(
        d.department_name,
        (currentMap.get(d.department_name) ?? 0) + d.amount
      );
    } else if (previousMonth && monthKey === previousMonth) {
      previousMap.set(
        d.department_name,
        (previousMap.get(d.department_name) ?? 0) + d.amount
      );
    }
  });

  // Combine & compute percent change
  const allDepartments = new Set([...currentMap.keys(), ...previousMap.keys()]);

  return Array.from(allDepartments).map((name) => {
    const current = currentMap.get(name) ?? 0;
    const previous = previousMap.get(name) ?? 0;
    const percent_change =
      previous === 0 ? 0 : ((current - previous) / previous) * 100;

    return {
      department_name: name,
      current_amount: current,
      previous_amount: previous,
      percent_change: Number(percent_change.toFixed(2)),
      store_name: formatted[0].store_name,
    };
  });
};
