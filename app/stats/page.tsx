'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Wallet, Banknote, DollarSign, Store } from 'lucide-react';

export default function StatsPage() {
  return (
    <div className='p-6 space-y-6'>
      <h1 className='text-3xl font-bold text-primary tracking-tight mb-4 flex items-center gap-2'>
        <Store className='w-5 h-5 flex-shrink-0 text-primary' /> Store Stats
      </h1>
    </div>
  );
}
