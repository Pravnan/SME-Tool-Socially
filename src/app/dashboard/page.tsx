'use client'; // ✅ Ensures this is a Client Component

import { useSession } from 'next-auth/react';

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="p-6 text-gray-900 dark:text-white">Loading...</div>;
  }

  return (
    <div className="p-6 text-gray-900 dark:text-white">
      <h1 className="text-2xl font-bold">
        {session?.user?.name
          ? `Hello, ${session.user.name}! 👋`
          : 'Welcome to your dashboard'}
      </h1>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
        {session?.user?.email && `Logged in as ${session.user.email}`}
      </p>
    </div>
  );
}
