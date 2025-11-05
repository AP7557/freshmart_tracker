import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import './globals.css';
import Link from 'next/link';
import Image from 'next/image';
import { AuthButton } from '@/components/auth/auth-button';

// ✅ Custom Site Metadata
const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Freshmart',
  description:
    'Family-owned convenience stores throughout Central Jersey, committed to exceptional service and community values.',
};

// ✅ Geist Font
const geistSans = Geist({
  variable: '--font-geist-sans',
  display: 'swap',
  subsets: ['latin'],
});

// ✅ Root Layout
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${geistSans.className} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='dark'
          disableTransitionOnChange
        >
          <div className='min-h-svh flex flex-col'>
            <header className='w-full border-b border-border bg-primary text-primary-foreground print:hidden'>
              <div className='max-w-5xl mx-auto flex items-center justify-between px-6 py-3'>
                <Link href='/' className='flex items-center gap-3'>
                  <Image
                    src='/fm-logo.jpeg'
                    alt='Freshmart Logo'
                    width={36}
                    height={36}
                    className='rounded-full flex-shrink-0'
                  />
                  <span className='text-xl font-bold hidden  lg:block'>
                    Freshmart
                  </span>
                </Link>

                <AuthButton />
              </div>
            </header>
            <main className='flex-1 place-content-center'>{children}</main>
            <footer className='w-full border-t border-border bg-background text-muted-foreground text-xs print:hidden'>
              <div className='max-w-5xl mx-auto flex flex-col md:flex-row justify-center px-6 py-8 gap-4'>
                <p>
                  &copy; {new Date().getFullYear()} Freshmart. All rights
                  reserved.
                </p>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
