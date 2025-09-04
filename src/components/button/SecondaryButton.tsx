'use client';

import Link from 'next/link';

interface SecondaryButtonProps {
  href: string;
  children: React.ReactNode;
}

export default function SecondaryButton({ href, children }: SecondaryButtonProps) {
  return (
    <Link
      href={href}
      className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-gray-900 rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
    >
      <svg
        className="mr-2 -ml-1 w-5 h-5"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>
      </svg>
      {children}
    </Link>
  );
}
