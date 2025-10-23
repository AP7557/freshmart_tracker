import { getGlobalOptions } from '@/lib/api/lookups';
import { GlobalDataProvider } from './GlobalDataProvider';

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let data;

  try {
    data = await getGlobalOptions();
  } catch {
    data = {
      userRole: 'user',
      storeOptions: [],
      companyOptions: [],
      typeOptions: [],
      departmentOptions: [],
    };
  }

  return <GlobalDataProvider value={data}>{children}</GlobalDataProvider>;
}
