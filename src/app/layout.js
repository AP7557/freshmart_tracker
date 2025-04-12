// app/layout.js
"use client";
import { AuthProvider } from "../context/AuthContext";
import { DataProvider } from "@/context/DataContext";
import Navbar from "@/components/Navbar";
import "../styles/globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Freshmart Tracker</title>
      </head>
      <body className="h-full font-sans antialiased text-gray-800">
        <AuthProvider>
          <DataProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1 container mx-auto px-4 py-8">
                {children}
              </main>
              <footer className="bg-white border-t border-gray-200 py-6">
                <div className="container mx-auto px-4 text-center text-gray-600">
                  <p>© {new Date().getFullYear()} Freshmart Tracker</p>
                </div>
              </footer>
            </div>
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
