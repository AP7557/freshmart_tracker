// components/Navbar.js
'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase';

export default function Navbar() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <header className='bg-blue-600 p-4 text-white rounded-lg shadow-md'>
        <div className='flex justify-between items-center'>
          <h1 className='text-3xl font-semibold'>Store Dashboard</h1>
          <div className='animate-pulse'>Loading...</div>
        </div>
      </header>
    );
  }

  return (
    <header className='bg-blue-600 p-4 text-white rounded-lg shadow-md'>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-semibold'>Store Dashboard</h1>

        <nav className='mt-4'>
          <ul className='flex space-x-4 items-center'>
            {user ? (
              <>
                {user.canViewOverview && (
                  <li>
                    <Link
                      href='/overview'
                      className='hover:text-yellow-400 transition duration-200'
                    >
                      Overview
                    </Link>
                  </li>
                )}

                <li>
                  <Link
                    href='/addTransactions'
                    className='hover:text-yellow-400 transition duration-200'
                  >
                    Add Transaction
                  </Link>
                </li>

                {user.role === 'master' && (
                  <li>
                    <Link
                      href='/userManagement'
                      className='hover:text-yellow-400 transition duration-200'
                    >
                      User Management
                    </Link>
                  </li>
                )}

                <li>
                  <button
                    onClick={() => signOut(auth)}
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
      </div>
    </header>
  );
}
