'use client';

import Link from 'next/link';
import { useState } from 'react';
import { HiOutlineMenu, HiOutlineViewGrid } from 'react-icons/hi';
import {
  IoClose,
  IoAddCircleOutline,
  IoCheckmarkDoneOutline,
} from 'react-icons/io5';
import { useGlobalData } from '../GlobalDataProvider';

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userRole } = useGlobalData();

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className='min-h-svh flex flex-col'>
      <header className='w-full border-b border-border bg-primary-foreground shadow px-6 py-4'>
        <div className='flex items-center justify-between'>
          <Link
            href='/portal/dashboard'
            className='text-xl font-bold flex items-center gap-2'
          >
            <HiOutlineViewGrid className='w-5 h-5 flex-shrink-0' />
            Vendor Payouts
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
            href='/portal/vendor/add-payout'
            className='flex items-center gap-1'
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <IoAddCircleOutline className='w-5 h-5 flex-shrink-0' />
            Add Payout
          </Link>
          {userRole && ['manager', 'admin'].includes(userRole) && (
            <Link
              href='/portal/vendor/posted'
              className='flex items-center gap-1'
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <IoCheckmarkDoneOutline className='w-5 h-5 flex-shrink-0' />
              Verify Checks/ACH
            </Link>
          )}
        </nav>
      </header>

      <main className='flex-1 p-6 place-content-center'>{children}</main>
    </div>
  );
}
