'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

export function withAuth(Component, allowedRoles = []) {
  return function AuthenticatedComponent(props) {
    const router = useRouter();
    const { user, loading } = useAuth();

    useEffect(() => {
      if (!loading && !user) {
        router.push('/login');
      }

      if (
        !loading &&
        user &&
        allowedRoles.length > 0 &&
        !allowedRoles.includes(user.role)
      ) {
        router.push('/addTransactions');
      }
    }, [user, loading, router]);

    if (loading || !user) return <div>Loading...</div>;
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      return <div>Unauthorized</div>;
    }

    return (
      <Component
        {...props}
        user={user}
      />
    );
  };
}
