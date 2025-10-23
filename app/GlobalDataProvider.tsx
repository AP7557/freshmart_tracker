'use client';

import { OptionsType } from '@/types/type';
import { createContext, useContext } from 'react';

type GlobalDataContextType = {
  userRole: string;
  storeOptions: OptionsType;
  companyOptions: OptionsType;
  typeOptions: OptionsType;
  departmentOptions: OptionsType;
};

const GlobalDataContext = createContext<GlobalDataContextType | null>(null);

export function GlobalDataProvider({
  value,
  children,
}: {
  value: GlobalDataContextType;
  children: React.ReactNode;
}) {
  return (
    <GlobalDataContext.Provider value={value}>
      {children}
    </GlobalDataContext.Provider>
  );
}

export function useGlobalData() {
  const ctx = useContext(GlobalDataContext);
  if (!ctx)
    throw new Error('useGlobalData must be used within a GlobalDataProvider');
  return ctx;
}
