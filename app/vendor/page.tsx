'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function VendorHome() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/vendor/add-payout');
  }, [router]);

  return null; // Nothing needs to render since user is redirected
}
