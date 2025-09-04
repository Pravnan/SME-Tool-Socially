'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type Platform = 'instagram' | 'facebook' | 'linkedin';

type Row = {
  platform: Platform;
  name: string;
  connected: boolean;
};

function PlatformIcon({ platform }: { platform: Platform }) {
  switch (platform) {
    case 'instagram':
      return <span className="text-pink-500 text-lg">📸</span>;
    case 'facebook':
      return <span className="text-blue-600 text-lg">📘</span>;
    case 'linkedin':
      return <span className="text-sky-700 text-lg">💼</span>;
    default:
      return <span>🌐</span>;
  }
}

export default function ConnectAccountsCard() {
  const [isOpen, setIsOpen] = useState(false);

  const rows: Row[] = [
    { platform: 'instagram', name: 'Instagram Business', connected: false },
    { platform: 'facebook', name: 'Facebook Page', connected: false },
    { platform: 'linkedin', name: 'LinkedIn Company Page', connected: false },
  ];

  const handleConnect = (platform: Platform) => {
    // ✅ This will hit your backend which redirects to OAuth
    window.location.href = `/api/accounts/${platform}/start`;
  };

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-5">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between"
      >
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Connect accounts
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 text-left">
            Link your social profiles to schedule and auto-post.
          </p>
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>

      {/* Dropdown content */}
      {isOpen && (
        <ul className="mt-4 space-y-3">
          {rows.map((r) => (
            <li
              key={r.platform}
              className="flex items-center justify-between rounded-xl border border-gray-200 dark:border-white/10 p-3"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-white/10">
                  <PlatformIcon platform={r.platform} />
                </span>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {r.name}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {r.connected ? 'Connected' : 'Not connected'}
                  </div>
                </div>
              </div>

              {r.connected ? (
                <button className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50 dark:hover:bg-white/10">
                  Unlink
                </button>
              ) : (
                <button
                  onClick={() => handleConnect(r.platform)}
                  className="rounded-md bg-indigo-600 px-3 py-1.5 text-white text-sm hover:bg-indigo-700"
                >
                  Connect
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
