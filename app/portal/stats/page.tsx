'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function StatsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/portal/stats/register');
  }, [router]);

  return null; // Nothing needs to render since user is redirected
}
