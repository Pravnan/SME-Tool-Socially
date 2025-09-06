'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type Platform = 'instagram';

type Row = {
  platform: Platform;
  name: string;
  connected: boolean;
};

function PlatformIcon({ platform }: { platform: Platform }) {
  if (platform === 'instagram') {
    return <span className="text-pink-500 text-lg">📸</span>;
  }
  return <span>🌐</span>;
}

export default function ConnectAccountsCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [rows, setRows] = useState<Row[]>([
    { platform: 'instagram', name: 'Instagram Business', connected: false },
  ]);
  const [notification, setNotification] = useState<string | null>(null);

  // ✅ Fetch connection status from backend
  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch('/api/accounts/status');
        if (res.ok) {
          const data = await res.json();
          setRows([
            {
              platform: 'instagram',
              name: 'Instagram',
              connected: data.status?.instagram || false,
            },
          ]);
        }
      } catch (err) {
        console.error('Failed to fetch account status:', err);
      }
    }
    fetchStatus();
  }, []);

  // auto-clear notification after 3s
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleConnect = (platform: Platform) => {
    setNotification('✅ Connection started. Please complete login.');
    window.location.href = `/api/accounts/${platform}/start`;
  };

  const handleUnlink = async (platform: Platform) => {
    try {
      const res = await fetch(`/api/accounts/${platform}/unlink`, {
        method: 'POST',
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Unlink failed');

      // update local state
      setRows((prev) =>
        prev.map((r) =>
          r.platform === platform ? { ...r, connected: false } : r
        )
      );

      setNotification('⚠️ Your account has been unlinked.');
    } catch (err) {
      console.error('Unlink error:', err);
      alert('Failed to unlink account');
    }
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
            Connect account
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 text-left">
            Link your Instagram profile to schedule and auto-post.
          </p>
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>

      {/* Notification */}
      {notification && (
        <div className="mt-3 rounded-md bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm p-2">
          {notification}
        </div>
      )}

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
                <button
                  onClick={() => handleUnlink(r.platform)}
                  className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50 dark:hover:bg-white/10"
                >
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
