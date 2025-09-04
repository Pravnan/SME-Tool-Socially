'use client';

import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import ChoiceCard from '@/components/welcome/ChoiceCard';

function getInitials(name?: string | null) {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last || first || 'U').toUpperCase();
}

export default function WelcomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loadingStatus, setLoadingStatus] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;

    // 🚀 If admin, skip onboarding completely
    if (session?.user && (session.user as any).role === 'admin') {
      router.replace('/admin');
      return;
    }

    async function checkStatus() {
      if (!session?.user?.email) return;

      try {
        const res = await fetch('/api/onboarding/status');
        if (res.ok) {
          const data = await res.json();
          if (!data.needsOnboarding) {
            // ✅ Already onboarded → go straight to dashboard
            router.replace('/dashboard');
            return;
          }
        }
      } catch (e) {
        console.error('Failed to check onboarding status', e);
      }

      // Show onboarding if not redirected
      setLoadingStatus(false);
    }

    if (status === 'authenticated') {
      checkStatus();
    }
  }, [status, session, router]);

  if (status === 'loading' || loadingStatus) {
    return <div className="p-6">Loading…</div>;
  }

  if (!session) {
    router.push('/login');
    return null;
  }

  const name = session.user?.name ?? 'there';
  const firstName = name.split(' ')[0];
  const avatarUrl = session.user?.image;

  async function handleChoice(choice: 'assets' | 'new') {
    try {
      await fetch('/api/onboarding/choice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ choice }),
      });
    } catch (e) {
      console.error('Failed to save onboarding choice', e);
    }
    router.push(choice === 'assets' ? '/assets-dashboard' : '/onboarding-wizard');
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-sky-50 dark:from-[#0b1020] dark:via-[#0b1020] dark:to-[#0a0f1d]">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 hidden h-72 w-72 rounded-full bg-indigo-400/30 blur-3xl dark:bg-indigo-600/20 md:block" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 hidden h-80 w-80 rounded-full bg-sky-300/30 blur-3xl dark:bg-sky-600/20 md:block" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 -z-10 hidden h-64 w-64 -translate-x-1/2 rounded-full bg-fuchsia-300/20 blur-3xl dark:bg-fuchsia-600/10 md:block" />

      {/* Page layout */}
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 sm:px-6">
        {/* Header */}
        <header className="flex items-center justify-between py-4 sm:py-6">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 overflow-hidden rounded-full ring-2 ring-white/70 dark:ring-white/10 shadow sm:h-10 sm:w-10">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500 to-sky-500 text-xs font-semibold text-white sm:text-sm">
                  {getInitials(name)}
                </div>
              )}
            </div>
            <div className="leading-tight">
              <p className="text-xs text-gray-600 dark:text-gray-400">Welcome to Socially </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white sm:text-base">{firstName}</p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="rounded-full bg-red-500 px-3 py-1.5 text-xs font-medium text-white shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 sm:px-4 sm:py-2 sm:text-sm"
          >
            Logout
          </button>
        </header>

        {/* Main */}
        <main className="flex flex-1 items-center justify-center py-6 sm:py-10">
          <div className="w-full max-w-5xl">
            <div className="mx-auto max-w-3xl text-center px-2">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl md:text-4xl">
                Let’s get your brand set up
              </h1>
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 sm:text-base">
                Do you have existing brand assets (captions, guidelines, products)? Choose a path below.
              </p>
            </div>

            <div className="mx-auto mt-6 max-w-4xl rounded-2xl border border-gray-200/70 bg-white/80 p-4 shadow-xl backdrop-blur-md dark:border-white/10 dark:bg-white/5 sm:mt-8 sm:rounded-3xl sm:p-6 md:p-8">
              <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                <ChoiceCard
                  title="Yes, I have brand assets"
                  description="Upload past posts, captions, and brand guidelines to personalize your AI quickly."
                  onClick={() => handleChoice('assets')}
                />
                <ChoiceCard
                  title="No, I’m just starting out"
                  description="Answer a short questionnaire so we can create a personalized brand profile for you."
                  onClick={() => handleChoice('new')}
                />
              </div>

              <div className="mt-5 text-center sm:mt-6">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="text-xs text-gray-600 underline underline-offset-2 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 sm:text-sm"
                >
                  Skip for now
                </button>
              </div>
            </div>

            {/* Tips */}
            <div className="mx-auto mt-6 grid max-w-4xl grid-cols-1 gap-2 px-1 sm:mt-8 sm:grid-cols-3 sm:gap-3">
              <div className="rounded-xl border border-gray-200/70 bg-white/70 p-3 text-xs text-gray-700 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-gray-300">
                ✅ Personalize outputs for tone & style
              </div>
              <div className="rounded-xl border border-gray-200/70 bg-white/70 p-3 text-xs text-gray-700 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-gray-300">
                🧠 We save your choice to improve suggestions
              </div>
              <div className="rounded-xl border border-gray-200/70 bg-white/70 p-3 text-xs text-gray-700 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-gray-300">
                🔒 You control and can change this later
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
