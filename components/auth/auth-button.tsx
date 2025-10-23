'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '../ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Import lucide-react icons
import { LogOut, User, LogIn } from 'lucide-react';

export function AuthButton() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth');
  };

  useEffect(() => {
    const supabase = createClient();

    // Check current session
    const getSession = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUserEmail(user?.email ?? null);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      getSession();
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return userEmail ? (
    <div className='flex items-center gap-4 flex-wrap justify-end'>
      <User className='w-5 h-5 flex-shrink-0 text-primary' />
      <span>Hey, {userEmail}!</span>
      <Button
        onClick={logout}
        variant={'secondary'}
        className='flex items-center gap-2'
      >
        <LogOut className='w-5 h-5 flex-shrink-0' />
        Logout
      </Button>
    </div>
  ) : (
    <div className='flex gap-2'>
      <Button
        asChild
        size='sm'
        variant={'secondary'}
        className='flex items-center gap-2'
      >
        <Link href='/auth'>
          <LogIn className='w-5 h-5 flex-shrink-0 inline mr-1' />
          Sign in
        </Link>
      </Button>
    </div>
  );
}
