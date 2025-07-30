'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function VendorHome() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to /dashboard immediately
    router.replace('/vendor/dashboard');
  }, [router]);

  return null; // Nothing needs to render since user is redirected
}
