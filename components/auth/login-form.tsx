'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FcGoogle } from 'react-icons/fc';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

// Import lucide-react icons
import { Mail, Lock, LogIn, UserPlus, User } from 'lucide-react';

type Mode = 'login' | 'signup';

export function LoginForm({
  defaultMode = 'login',
  className,
}: {
  defaultMode?: Mode;
  className?: string;
}) {
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: name,
            },
          },
        });
        if (error) throw error;
        router.push('/');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push('/');
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: process.env.NEXT_PUBLIC_REDIRECT_URL,
      },
    });

    if (error) console.error('OAuth login error:', error.message);
  };

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <Card>
        <CardHeader className='text-center'>
          <CardTitle className='text-xl flex justify-center items-center gap-2'>
            {mode === 'signup' ? (
              <>
                <UserPlus className='w-5 h-5 flex-shrink-0' /> Welcome
              </>
            ) : (
              <>
                <LogIn className='w-5 h-5 flex-shrink-0' /> Welcome back
              </>
            )}
          </CardTitle>
          <CardDescription>
            {mode === 'signup' ? 'Sign up' : 'Login'} with your Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth}>
            <div className='grid gap-6'>
              <div className='flex flex-col gap-4'>
                <Button
                  type='button'
                  variant='secondary'
                  onClick={handleGoogleLogin}
                  className='w-full flex items-center justify-center gap-2'
                >
                  <FcGoogle />
                  {mode === 'signup' ? 'Sign up' : 'Login'} with Google
                </Button>
              </div>
              <div className='after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
                <span className='bg-card text-muted-foreground relative z-10 px-2'>
                  Or continue with
                </span>
              </div>
              <div className='grid gap-6'>
                {mode === 'signup' && (
                  <div className='grid gap-3 relative'>
                    <Label htmlFor='name' className='flex items-center gap-1'>
                      <User className='w-5 h-5 flex-shrink-0' />
                      Name
                    </Label>
                    <Input
                      id='name'
                      type='name'
                      placeholder='Name'
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className='pl-10'
                    />
                  </div>
                )}
                <div className='grid gap-3 relative'>
                  <Label htmlFor='email' className='flex items-center gap-1'>
                    <Mail className='w-5 h-5 flex-shrink-0' />
                    Email
                  </Label>
                  <Input
                    id='email'
                    type='email'
                    placeholder='you@example.com'
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='pl-10'
                  />
                </div>
                <div className='grid gap-3 relative'>
                  <div className='flex items-center justify-between'>
                    <Label
                      htmlFor='password'
                      className='flex items-center gap-1'
                    >
                      <Lock className='w-5 h-5 flex-shrink-0' />
                      Password
                    </Label>
                    <a
                      href='/auth/forgot-password'
                      className='text-sm underline-offset-4 hover:underline'
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    id='password'
                    type='password'
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='pl-10'
                  />
                </div>
                {error && <p className='text-sm text-red-500'>{error}</p>}
                <Button
                  type='submit'
                  className='w-full flex items-center justify-center gap-2'
                  disabled={isLoading}
                >
                  {isLoading ? (
                    mode === 'signup' ? (
                      'Creating account...'
                    ) : (
                      'Logging in...'
                    )
                  ) : mode === 'signup' ? (
                    <>
                      <UserPlus className='w-5 h-5 flex-shrink-0' />
                      Sign up
                    </>
                  ) : (
                    <>
                      <LogIn className='w-5 h-5 flex-shrink-0' />
                      Login
                    </>
                  )}
                </Button>
              </div>
              <div className='text-center text-sm'>
                {mode === 'signup' ? (
                  <>
                    Already have an account?{' '}
                    <button
                      type='button'
                      onClick={() => setMode('login')}
                      className='underline underline-offset-4 text-primary'
                    >
                      Login
                    </button>
                  </>
                ) : (
                  <>
                    Don&apos;t have an account?{' '}
                    <button
                      type='button'
                      onClick={() => setMode('signup')}
                      className='underline underline-offset-4 text-primary'
                    >
                      Sign up
                    </button>
                  </>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
