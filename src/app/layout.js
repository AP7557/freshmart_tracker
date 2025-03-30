// app/layout.js

'use client';  // If you are using React hooks

import Link from 'next/link';
import { AuthProvider } from '../context/AuthContext'; // Authentication context
import '../styles/globals.css'; // Global styles

export default function Layout({ children }) {
  return (
    <>
      <html lang="en">
        <head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Store Dashboard</title>
        </head>
        <body className="bg-gray-50 font-sans text-gray-800">
          <AuthProvider>
            <div className="max-w-screen-xl mx-auto p-4">
              <header className="bg-blue-600 p-4 text-white rounded-lg shadow-md">
                <h1 className="text-3xl font-semibold">Store Dashboard</h1>
                <nav className="mt-4">
                  <ul className="flex space-x-4">
                    <li>
                      <Link href="/" className="hover:text-yellow-400 transition duration-200">Home</Link>
                    </li>
                    <li>
                      <Link href="/login" className="hover:text-yellow-400 transition duration-200">Login</Link>
                    </li>
                    <li>
                      <Link href="/profile" className="hover:text-yellow-400 transition duration-200">Profile</Link>
                    </li>
                    {/* Add more links if needed */}
                  </ul>
                </nav>
              </header>
              <main className="mt-8">{children}</main>
              <footer className="text-center mt-8 py-4 text-gray-600">
                <p>&copy; 2025 Store Dashboard. All rights reserved.</p>
              </footer>
            </div>
          </AuthProvider>
        </body>
      </html>
    </>
  );
}
