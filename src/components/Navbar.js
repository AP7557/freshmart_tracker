// components/Navbar.js
"use client";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { useState } from "react";
import {
  FiMenu,
  FiX,
  FiHome,
  FiPlusCircle,
  FiUsers,
  FiLogOut,
} from "react-icons/fi";
import Link from "next/link";

export default function Navbar() {
  const { user, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <header className="bg-[#15803d] text-white shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Loading...</h1>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-[#15803d] text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded hover:bg-[#166534] transition-colors"
            >
              {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
            <Link
              href="/overview"
              className="text-xl font-bold hover:text-[#bbf7d0] transition-colors"
            >
              Freshmart Tracker
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {user && (
              <>
                {user.role !== "user" && (
                  <Link
                    href="/overview"
                    className="flex items-center space-x-1 hover:text-[#bbf7d0] transition-colors"
                  >
                    <FiHome size={18} />
                    <span>Overview</span>
                  </Link>
                )}
                <Link
                  href="/addTransactions"
                  className="flex items-center space-x-1 hover:text-[#bbf7d0] transition-colors"
                >
                  <FiPlusCircle size={18} />
                  <span>Add Transaction</span>
                </Link>
                {user.role === "admin" && (
                  <Link
                    href="/userManagement"
                    className="flex items-center space-x-1 hover:text-[#bbf7d0] transition-colors"
                  >
                    <FiUsers size={18} />
                    <span>Users</span>
                  </Link>
                )}
                <button
                  onClick={() => signOut(auth)}
                  className="flex items-center space-x-1 hover:text-[#bbf7d0] transition-colors"
                >
                  <FiLogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2">
            {user ? (
              <>
                {user.role !== "user" && (
                  <Link
                    href="/overview"
                    className="block p-2 hover:bg-[#166534] rounded transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Overview
                  </Link>
                )}
                <Link
                  href="/addTransactions"
                  className="block p-2 hover:bg-[#166534] rounded transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Add Transaction
                </Link>
                {user.role === "admin" && (
                  <Link
                    href="/userManagement"
                    className="block p-2 hover:bg-[#166534] rounded transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    User Management
                  </Link>
                )}
                <button
                  onClick={() => {
                    signOut(auth);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left p-2 hover:bg-[#166534] rounded transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block p-2 text-center bg-[#16a34a] hover:bg-[#22c55e] rounded transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
