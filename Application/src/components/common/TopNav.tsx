'use client';

import Link from 'next/link';

export default function TopNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-white/70 dark:bg-[#0b1020]/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Left: Brand */}
        <Link href="/dashboard" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/logo.svg"
            alt="Logo"
            className="h-8 w-auto"
          />

        </Link>

        {/* Right: actions (can add user menu later) */}
        <nav className="flex items-center gap-2">
          <Link
            href="/assets-dashboard"
            className="hidden rounded-lg border border-gray-200/70 px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 dark:border-white/10 dark:text-gray-200 dark:hover:bg-white/10 md:inline"
          >
            Upload assets
          </Link>
          <Link
            href="/create"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Create Post
          </Link>
        </nav>
      </div>
    </header>
  );
}
