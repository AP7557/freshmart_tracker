'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ComboBox } from '@/components/shared/combobox';
import { OptionsType } from '@/types/type';
import { User, Users, Store, LayoutGrid } from 'lucide-react';
import {
  getAllStores,
  getAllUsers,
  updateUserRole,
  updateUserStores,
} from '@/db/db-calls';
import { MultiSelectComboBox } from '@/components/dashboard/combobox-multiselect';

interface UserType {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'manager' | 'admin';
  stores: { id: number; name: string }[];
}

export default function ManageUsersPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [storeOptions, setStoreOptions] = useState<OptionsType>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const allStores = await getAllStores();
      if (allStores?.allStoresData) setStoreOptions(allStores.allStoresData);

      const allUsers = await getAllUsers();
      if (allUsers?.usersData) setUsers(allUsers.usersData);

      setLoading(false);
    })();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    const { error } = await updateUserRole(userId, newRole as UserType['role']);

    if (!error) {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? { ...user, role: newRole as UserType['role'] }
            : user
        )
      );
    }
  };

  const handleStoreChange = async (userId: string, storeName: string) => {
    const userObj = users.find((user) => user.id === userId);
    const storeObj = storeOptions.find((store) => store.name === storeName);
    if (!storeObj || !userObj) return;

    const exists = userObj.stores.some((s) => s.id === storeObj.id);

    const newStores = exists
      ? userObj.stores.filter((s) => s.id !== storeObj.id)
      : [...userObj.stores, storeObj];

    const { error } = await updateUserStores(userId, storeObj.id, exists);

    if (!error) {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, stores: newStores } : user
        )
      );
    }
  };

  return (
    <div className='p-6'>
      <h1 className='text-3xl font-bold mb-8 flex items-center gap-2 text-[hsl(var(--primary))]'>
        <Users className='w-8 h-8' /> Manage Users
      </h1>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
            <Skeleton
              key={i}
              className='h-48 rounded-xl'
            />
          ))
          : users.map((user) => (
            <Card
              key={user.id}
              className='hover:shadow-lg transition-all border border-[hsl(var(--border))] rounded-xl'
            >
              <CardHeader className='pb-2 flex flex-col gap-1'>
                <CardTitle className='text-lg font-semibold truncate text-[hsl(var(--foreground))] flex items-center gap-2'>
                  <User className='w-5 h-5 text-[hsl(var(--primary))]' />{' '}
                  {user.name || 'No Name'}
                </CardTitle>
                <p className='text-sm text-[hsl(var(--muted-foreground))] truncate flex items-center gap-1'>
                  <LayoutGrid className='w-4 h-4' /> {user.email}
                </p>
              </CardHeader>

              <CardContent className='space-y-4'>
                <div className='flex flex-col gap-1'>
                  <label className='text-sm font-medium text-[hsl(var(--foreground))] flex items-center gap-1'>
                    <Users className='w-4 h-4 text-[hsl(var(--primary))]' />{' '}
                    Role
                  </label>
                  <ComboBox
                    options={[
                      { id: 1, name: 'user' },
                      { id: 2, name: 'manager' },
                      { id: 3, name: 'admin' },
                    ]}
                    selectedValue={user.role}
                    setValue={(value) => handleRoleChange(user.id, value)}
                    placeholder='Select Role'
                    canAddNewValues={false}
                  />
                </div>

                <div className='flex flex-col gap-1'>
                  <label className='text-sm font-medium text-[hsl(var(--foreground))] flex items-center gap-1'>
                    <Store className='w-4 h-4 text-[hsl(var(--primary))]' />{' '}
                    Store Access
                  </label>
                  <MultiSelectComboBox
                    selectedValue={user.stores.map(({ name }) => name)}
                    setValue={(value) => handleStoreChange(user.id, value)}
                    options={storeOptions}
                    placeholder='Select Store'
                  />
                  <div className='mt-2 flex flex-wrap gap-2'>
                    {user.stores.map((s) => (
                      <Badge
                        key={s.id}
                        variant='secondary'
                        className='bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-md px-2 py-1 flex items-center gap-1'
                      >
                        <Store className='w-3 h-3' /> {s.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}
