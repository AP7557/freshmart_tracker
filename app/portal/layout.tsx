import { getGlobalOptions } from '@/lib/api/lookups';
import { GlobalDataProvider } from './GlobalDataProvider';
import PortalHeader from './PortalHeader';

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

  return (
    <GlobalDataProvider value={data}>
      <PortalHeader>{children}</PortalHeader>
    </GlobalDataProvider>
  );
}
