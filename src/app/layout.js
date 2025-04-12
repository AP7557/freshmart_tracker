// app/layout.js
'use client';

import { AuthProvider } from '../context/AuthContext';
import '../styles/globals.css';
import { DataProvider } from '@/context/DataContext';
import Navbar from './navbar';

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <head>
        <meta charSet='UTF-8' />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1'
        />
        <title>Store Dashboard</title>
      </head>
      <body className='bg-gray-50 font-sans text-gray-800'>
        <AuthProvider>
          <DataProvider>
            <div className='max-w-screen-xl mx-auto p-4'>
              <Navbar />
              <main className='mt-8'>{children}</main>
              <footer className='text-center mt-8 py-4 text-gray-600'>
                <p>&copy; 2025 Store Dashboard. All rights reserved.</p>
              </footer>
            </div>
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
