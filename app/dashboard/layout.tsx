'use client';

import LatestUpdatesDialog from '@/components/dashboard/latest-updates';
import { getUserRole } from '@/db/db-calls';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { HiOutlineMenu, HiOutlineViewGrid } from 'react-icons/hi';
import {
    IoClose,
    IoPeopleOutline,
} from 'react-icons/io5';
import { GiPayMoney } from "react-icons/gi";
import { MdQueryStats } from "react-icons/md";

export default function VendorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            const userRole = await getUserRole();
            if (userRole?.data) setRole(userRole.data[0].role);
        })();
    }, []);

    const [showUpdates, setShowUpdates] = useState(false);

    useEffect(() => {
        // Optionally, only show if user hasn't seen latest updates
        const hasSeen = localStorage.getItem('seenUpdates');
        if (!hasSeen) {
            setShowUpdates(true);
        }
    }, []);

    return (
        <div className='min-h-svh flex flex-col'>
            <header className='w-full border-b border-border bg-primary-foreground shadow px-6 py-4'>
                <div className='flex items-center justify-between'>
                    <Link
                        href='/dashboard'
                        className='text-xl font-bold flex items-center gap-2'
                    >
                        <HiOutlineViewGrid className='w-5 h-5 flex-shrink-0' />
                        Dashboard
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
                    className={`flex-col justify-end gap-4 mt-4 md:mt-0 md:flex md:flex-row md:gap-6 ${menuOpen ? 'flex' : 'hidden'
                        } md:flex`}
                >
                    <Link
                        href='/vendor'
                        className='flex items-center gap-1'
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <GiPayMoney className='w-5 h-5 flex-shrink-0' />
                        Vendor Payout
                    </Link>
                    {role && role === "admin" && (
                        <Link
                            href='/stats'
                            className='flex items-center gap-1'
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            <MdQueryStats className='w-5 h-5 flex-shrink-0' />
                            Store Stats
                        </Link>
                    )}
                    {role && 'admin' === role && (
                        <Link
                            href='/dashboard/users'
                            className='flex items-center gap-1'
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            <IoPeopleOutline className='w-5 h-5 flex-shrink-0' />
                            Manage Users
                        </Link>
                    )}
                </nav>
            </header>

            <main className='flex-1 p-6 place-content-center'>
                {children}
                <LatestUpdatesDialog
                    open={showUpdates}
                    onClose={() => setShowUpdates(false)}
                    version='v1.0'
                />
            </main>
        </div>
    );
}
