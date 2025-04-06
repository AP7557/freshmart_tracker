'use client';

import Link from 'next/link';
import '../styles/globals.css';
import { DataProvider } from '@/context/DataContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

function ProtectedLayout({ children }) {
  const { currentUser, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !currentUser && pathname !== '/login') {
      router.push('/login');
    }
  }, [currentUser, loading, pathname, router]);

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  return children;
}

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <head>
        <meta charSet='UTF-8' />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1'
        />
        <title>Store Dashboard</title>
      </head>
      <body className='bg-gray-50 font-sans text-gray-800'>
        <AuthProvider>
          <DataProvider>
            <ProtectedLayout>
              <div className='max-w-screen-xl mx-auto p-4'>
                <Header />
                <main className='mt-8'>{children}</main>
                <footer className='text-center mt-8 py-4 text-gray-600'>
                  <p>&copy; 2025 Store Dashboard. All rights reserved.</p>
                </footer>
              </div>
            </ProtectedLayout>
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

function Header() {
  const { currentUser } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className='bg-blue-600 p-4 text-white rounded-lg shadow-md'>
      <h1 className='text-3xl font-semibold'>Store Dashboard</h1>
      <nav className='mt-4'>
        <ul className='flex space-x-4'>
          {currentUser ? (
            <>
              <li>
                <Link
                  href='/overview'
                  className='hover:text-yellow-400 transition duration-200'
                >
                  Overview
                </Link>
              </li>
              <li>
                <Link
                  href='/addTodaysTransaction'
                  className='hover:text-yellow-400 transition duration-200'
                >
                  Add Transaction
                </Link>
              </li>
              <li>
                <button
                  onClick={handleSignOut}
                  className='hover:text-yellow-400 transition duration-200'
                >
                  Sign Out
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link
                href='/login'
                className='hover:text-yellow-400 transition duration-200'
              >
                Login
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
