'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { HiOutlineMenu, HiOutlineViewGrid } from 'react-icons/hi';
import {
  IoChevronDown,
  IoChevronUp,
  IoClose,
  IoPeopleOutline,
  IoAddCircleOutline,
  IoCheckmarkDoneOutline,
} from 'react-icons/io5';
import { GiPayMoney } from 'react-icons/gi';
import {
  MdQueryStats,
  MdPointOfSale,
  MdOutlineAccountTree,
} from 'react-icons/md';
import { useGlobalData } from './GlobalDataProvider';

const sections = (pathname: string) => {
  if (pathname.startsWith('/portal/dashboard')) return 'Dashboard';
  if (pathname.startsWith('/portal/vendor')) return 'Vendor Payouts';
  if (pathname.startsWith('/portal/stats')) return 'Store Stats';
  if (pathname.startsWith('/portal/admin')) return 'Admin';
  return '';
};

export default function PortalHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { userRole } = useGlobalData();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) =>
    setOpenSection((prev) => (prev === section ? null : section));

  return (
    <div className='min-h-svh flex flex-col'>
      {/* HEADER */}
      <header className='w-full border-b border-border bg-primary-foreground shadow px-6 py-4'>
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
          {/* LEFT: TITLE + MOBILE TOGGLE */}
          <div className='flex items-center justify-between md:justify-start gap-4'>
            <Link
              href='/portal/dashboard'
              className='text-xl font-bold flex items-center gap-2'
            >
              <HiOutlineViewGrid className='w-5 h-5 flex-shrink-0' />
              {sections(pathname)}
            </Link>

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

          {/* RIGHT: NAV */}
          <nav className={`${menuOpen ? 'block' : 'hidden'} md:block`}>
            <ul className='flex flex-col md:flex-row md:items-center gap-4 md:gap-8'>
              {/* VENDOR */}
              <li className='relative'>
                <button
                  onClick={() => toggleSection('vendor')}
                  className='flex items-center gap-1 font-medium whitespace-nowrap'
                >
                  <GiPayMoney className='w-5 h-5 flex-shrink-0' />
                  Vendor
                  {openSection === 'vendor' ? (
                    <IoChevronUp className='w-5 h-5 flex-shrink-0' />
                  ) : (
                    <IoChevronDown className='w-5 h-5 flex-shrink-0' />
                  )}
                </button>

                {openSection === 'vendor' && (
                  <ul
                    className='
                    mt-2 ml-6 flex flex-col gap-2 text-sm
                    md:absolute md:left-0 md:top-full md:mt-2 md:ml-0
                    md:min-w-[200px] md:rounded-md md:border md:bg-primary-foreground
                    md:shadow-md md:p-3
                  '
                  >
                    <Link
                      href='/portal/vendor/add-payout'
                      className='flex items-center gap-2'
                      onClick={() => {
                        setOpenSection(null);
                        setMenuOpen(false);
                      }}
                    >
                      <IoAddCircleOutline className='w-5 h-5 flex-shrink-0' />
                      Add Payout
                    </Link>

                    {['manager', 'admin'].includes(userRole ?? '') && (
                      <Link
                        href='/portal/vendor/posted'
                        className='flex items-center gap-2'
                        onClick={() => {
                          setOpenSection(null);
                          setMenuOpen(false);
                        }}
                      >
                        <IoCheckmarkDoneOutline className='w-5 h-5 flex-shrink-0' />
                        Posted Payouts
                      </Link>
                    )}
                  </ul>
                )}
              </li>

              {/* STATS */}
              {['manager', 'admin'].includes(userRole ?? '') && (
                <li className='relative'>
                  <button
                    onClick={() => toggleSection('stats')}
                    className='flex items-center gap-1 font-medium whitespace-nowrap'
                  >
                    <MdQueryStats className='w-5 h-5 flex-shrink-0' />
                    Store Stats
                    {openSection === 'stats' ? (
                      <IoChevronUp className='w-5 h-5 flex-shrink-0' />
                    ) : (
                      <IoChevronDown className='w-5 h-5 flex-shrink-0' />
                    )}
                  </button>

                  {openSection === 'stats' && (
                    <ul
                      className='
                    mt-2 ml-6 flex flex-col gap-2 text-sm
                    md:absolute md:left-0 md:top-full md:mt-2 md:ml-0
                    md:min-w-[200px] md:rounded-md md:border md:bg-primary-foreground
                    md:shadow-md md:p-3
                  '
                    >
                      <Link
                        href='/portal/stats/register'
                        className='flex items-center gap-2'
                        onClick={() => {
                          setOpenSection(null);
                          setMenuOpen(false);
                        }}
                      >
                        <MdPointOfSale className='w-5 h-5 flex-shrink-0' />
                        Register
                      </Link>
                      {userRole === 'admin' && (
                        <Link
                          href='/portal/stats/department'
                          className='flex items-center gap-2'
                          onClick={() => {
                            setOpenSection(null);
                            setMenuOpen(false);
                          }}
                        >
                          <MdOutlineAccountTree className='w-5 h-5 flex-shrink-0' />
                          Departments
                        </Link>
                      )}
                    </ul>
                  )}
                </li>
              )}

              {/* ADMIN */}
              {userRole === 'admin' && (
                <li>
                  <Link
                    href='/portal/admin/users'
                    className='flex items-center gap-1 font-medium whitespace-nowrap'
                    onClick={() => {
                      setOpenSection(null);
                      setMenuOpen(false);
                    }}
                  >
                    <IoPeopleOutline className='w-5 h-5 flex-shrink-0' />
                    Manage Users
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </header>

      <main className='flex-1 p-6'>{children}</main>
    </div>
  );
}
