'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PortalPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to /portal immediately
    router.replace('/portal/dashboard');
  }, [router]);

  return null;
}
