'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to /dashboard immediately
    router.replace('/vendor/dashboard');
  }, [router]);

  return null;
  // <main className='text-foreground flex flex-col items-center bg-background'>
  //   <div className='flex-1 w-full flex flex-col items-center'>
  //     {/* Hero Section */}
  //     <section className='w-full max-w-5xl flex flex-col items-center text-center px-6 py-20 gap-6'>
  //       <div className='rounded-full bg-secondary p-4 w-24 h-24 flex items-center justify-center'>
  //         <Image
  //           src='/fm-logo.jpeg'
  //           alt='Freshmart Logo'
  //           width={80}
  //           height={80}
  //           className='rounded-full'
  //         />
  //       </div>

  //       <h1 className='text-4xl md:text-5xl font-extrabold text-[hsl(var(--primary))] tracking-tight'>
  //         Welcome to Freshmart
  //       </h1>

  //       <p className='text-muted-foreground max-w-md'>
  //         Family-owned convenience stores across Central Jersey, dedicated to
  //         exceptional service and community care.
  //       </p>
  //     </section>

  //     {/* Features Section */}
  //     <section className='w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 px-6 py-12'>
  //       <div className='bg-card border border-border rounded-lg shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition'>
  //         <ShoppingCart className='w-10 h-10 text-[hsl(var(--primary))] mb-3' />
  //         <h3 className='text-lg font-semibold text-card-foreground'>
  //           Convenience
  //         </h3>
  //         <p className='text-muted-foreground mt-2'>
  //           Shop daily essentials at your local Freshmart store with ease.
  //         </p>
  //       </div>

  //       <div className='bg-card border border-border rounded-lg shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition'>
  //         <Users className='w-10 h-10 text-[hsl(var(--primary))] mb-3' />
  //         <h3 className='text-lg font-semibold text-card-foreground'>
  //           Community
  //         </h3>
  //         <p className='text-muted-foreground mt-2'>
  //           Supporting local families and fostering a strong community spirit.
  //         </p>
  //       </div>
  //     </section>

  //     {/* CTA Section */}
  //     <section className='w-full max-w-5xl text-center px-6 py-12'>
  //       <h2 className='text-3xl font-bold text-[hsl(var(--primary))] mb-4'>
  //         Ready to Get Started?
  //       </h2>
  //       <p className='text-muted-foreground mb-6'>
  //         Explore our stores and experience convenience while supporting your
  //         community.
  //       </p>
  //       <Link href='/vendor/dashboard'>
  //         <Button className='bg-primary text-primary-foreground px-6 py-3 text-lg font-semibold hover:bg-[hsl(var(--ring)/0.9)] transition'>
  //           Go to Dashboard
  //         </Button>
  //       </Link>
  //     </section>
  //   </div>
  // </main>
}
