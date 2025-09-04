'use client';

import { useSession } from 'next-auth/react';

export default function ModelStatusCard() {
  const { data: session } = useSession();
  const status = (session?.user as any)?.modelStatus as
    | 'none' | 'queued' | 'training' | 'ready' | 'error' | undefined;

  const badge =
    status === 'ready'
      ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
      : status === 'error'
      ? 'bg-rose-100 text-rose-700 border-rose-200'
      : status === 'training' || status === 'queued'
      ? 'bg-amber-100 text-amber-800 border-amber-200'
      : 'bg-gray-100 text-gray-700 border-gray-200';

  const label = status
    ? status[0].toUpperCase() + status.slice(1)
    : 'None';

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Personalized Model
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            Train a caption style model from your brand assets.
          </p>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full border ${badge}`}>
          {label}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {(!status || status === 'none') && (
          <a
            href="/assets-dashboard"
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-white text-sm font-medium hover:bg-indigo-700"
          >
            Train now
          </a>
        )}

        {(status === 'queued' || status === 'training') && (
          <a
            href="/assets-dashboard"
            className="rounded-md border px-3 py-1.5 text-sm"
          >
            View training
          </a>
        )}

        {status === 'ready' && (
          <>
            <a
              href="/create"
              className="rounded-md bg-emerald-600 px-3 py-1.5 text-white text-sm font-medium hover:bg-emerald-700"
            >
              Try generating
            </a>
            <a
              href="/assets-dashboard"
              className="rounded-md border px-3 py-1.5 text-sm"
            >
              Retrain
            </a>
          </>
        )}

        {status === 'error' && (
          <a
            href="/assets-dashboard"
            className="rounded-md bg-rose-600 px-3 py-1.5 text-white text-sm font-medium hover:bg-rose-700"
          >
            Fix & retry
          </a>
        )}
      </div>
    </div>
  );
}
