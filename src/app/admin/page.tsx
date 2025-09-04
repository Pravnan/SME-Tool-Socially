// src/app/admin/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { Users, BarChart2 } from 'lucide-react';
import UsersTable from '@/components/admin/UsersTable';
import AdminStats from '@/components/admin/AdminStats'; // ✅ import new stats component

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'stats'>('users');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* 🔹 Top bar */}
      <div className="sticky top-0 z-20 border-b border-gray-200/70 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-white/5">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/dashboard" className="flex items-center gap-2">
            <img src="/assets/logo.svg" alt="Logo" className="h-8 w-auto" />
            <span className="hidden text-sm font-semibold text-gray-900 dark:text-white sm:inline">
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-white/10"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* 🔹 Layout with sidebar */}
      <div className="mx-auto grid max-w-7xl grid-cols-12 gap-4 px-4 py-6">
        {/* Sidebar */}
        <aside className="col-span-3 space-y-4">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
              activeTab === 'users'
                ? 'bg-indigo-600 text-white'
                : 'border hover:bg-gray-50 dark:hover:bg-white/10'
            }`}
          >
            <Users className="h-4 w-4" /> Users
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
              activeTab === 'stats'
                ? 'bg-indigo-600 text-white'
                : 'border hover:bg-gray-50 dark:hover:bg-white/10'
            }`}
          >
            <BarChart2 className="h-4 w-4" /> Stats
          </button>
        </aside>

        {/* Main content */}
        <main className="col-span-9 space-y-4">
          {activeTab === 'users' && (
            <section className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-5">
              <UsersTable />
            </section>
          )}

          {activeTab === 'stats' && (
            <section className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-5">
              <AdminStats /> {/* ✅ now loads fancy charts instead of static numbers */}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
