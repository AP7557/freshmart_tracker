'use client';

import Link from 'next/link';
import { useState } from 'react';
import { HiOutlineMenu, HiOutlineViewGrid } from 'react-icons/hi';
import { IoClose } from 'react-icons/io5';
import { BsBoxes } from 'react-icons/bs';
import { FaBusinessTime, FaCashRegister } from 'react-icons/fa';
import { useGlobalData } from '../GlobalDataProvider';

export default function StatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userRole } = useGlobalData();

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className='min-h-svh flex flex-col'>
      <header className='w-full border-b border-border bg-primary-foreground shadow px-6 py-4 print:hidden'>
        <div className='flex items-center justify-between'>
          <Link
            href='/portal/dashboard'
            className='text-xl font-bold flex items-center gap-2'
          >
            <HiOutlineViewGrid className='w-5 h-5 flex-shrink-0' />
            Store Stats
          </Link>
          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className='md:hidden'
            aria-label='Toggle Menu'
          >
            {menuOpen ? (
              <IoClose className='w-5 h-5 flex-shrink-0' />
            ) : (
              <HiOutlineMenu className='w-5 h-5 flex-shrink-0' />
            )}
          </button>
        </div>

        {/* Nav links - hidden on mobile unless menu is open */}
        <nav
          className={`flex-col justify-end gap-4 mt-4 md:mt-0 md:flex md:flex-row md:gap-6 ${
            menuOpen ? 'flex' : 'hidden'
          } md:flex`}
        >
          <Link
            href='/portal/stats/register'
            className='flex items-center gap-1'
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <FaCashRegister className='w-5 h-5 flex-shrink-0' />
            Register
          </Link>
          {userRole === 'admin' && (
            <Link
              href='/portal/stats/department'
              className='flex items-center gap-1'
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <BsBoxes className='w-5 h-5 flex-shrink-0' />
              Department
            </Link>
          )}
          <Link
            href='/portal/stats/user-time-log'
            className='flex items-center gap-1'
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <FaBusinessTime className='w-5 h-5 flex-shrink-0' />
            Employee Time Log
          </Link>
        </nav>
      </header>

      <main className='flex-1 p-6 place-content-center'>{children}</main>
    </div>
  );
}
