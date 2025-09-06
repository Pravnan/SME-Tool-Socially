'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import GoogleSignInButton from '@/components/button/GoogleSignInButton';
import AppleSignInButton from '@/components/button/AppleSignInButton';
import PrimaryButton from '@/components/button/PrimaryButton';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleEmailLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = String(form.get('email') || '');
    const password = String(form.get('password') || '');

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (res?.error) {
      setError('Invalid email or password.');
      return;
    }

    // Success: go where you want users after login
    window.location.href = '/welcome';
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
      {/* Left side: Form */}
      <div className="flex flex-col justify-center px-6 sm:px-10 md:px-16 lg:px-24 py-12">
        <div className="w-full max-w-md mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center">
            Welcome back
          </h2>

          {/* Social Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <GoogleSignInButton
              className="w-full"
              onClick={() =>
                signIn('google', {
                  callbackUrl: '/dashboard?login=success',
                  prompt: 'select_account',
                })
              }
            />
            {/* Optional: Apple will error unless you configure Apple OAuth */}
            <AppleSignInButton
              className="w-full"
              onClick={() => signIn('apple')}
            />
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <hr className="border-gray-300 dark:border-gray-700" />
            <span className="absolute inset-0 flex justify-center -top-3 bg-white dark:bg-gray-900 px-2 text-sm text-gray-500 dark:text-gray-400">
              or
            </span>
          </div>

          {/* Error */}
          {error && (
            <p className="mb-4 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          {/* Email/Password Form */}
          <form className="space-y-5" onSubmit={handleEmailLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"            /* <-- added */
                placeholder="Enter your email"
                className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"        /* <-- added */
                placeholder="••••••••"
                className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-gray-600 dark:text-gray-400">
                <input type="checkbox" className="mr-2 accent-blue-500" />
                Remember me
              </label>
              <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">
                Forgot password?
              </a>
            </div>

            <PrimaryButton type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in to your account'}
            </PrimaryButton>
          </form>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-6 text-center">
            Don’t have an account?{' '}
            <Link href="/signup" className="text-blue-600 hover:underline dark:text-blue-400">
              Sign up
            </Link>
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
            <Link href="/" className="text-blue-600 hover:underline dark:text-blue-400">
              back to home
            </Link>
          </p>
        </div>
      </div>

      {/* Right side: Banner (unchanged) */}
      <div className="hidden lg:flex items-center justify-center bg-blue-600 text-white px-12 py-12">
         <div className="max-w-md">
          <h2 className="text-4xl font-extrabold mb-4 leading-tight">
            Create Smarter <br /> Post Faster
          </h2>
          <p className="mb-6 font-bold text-blue-100">
            Join the growing community of professionals using SOCIALLY to save time, stay consistent, and scale their online presence.
          </p>
          <div className="flex items-center space-x-4">
            <div className="flex -space-x-2 overflow-hidden">
              <img className="w-8 h-8 rounded-full ring-2 ring-white" src="/assets/avatar1.jpg" alt="User 1" />
              <img className="w-8 h-8 rounded-full ring-2 ring-white" src="/assets/avatar2.jpg" alt="User 2" />
              <img className="w-8 h-8 rounded-full ring-2 ring-white" src="/assets/avatar3.jpg" alt="User 3" />
            </div>
            <p className="text-sm">
              Over <span className="font-bold">1.2k Happy Users</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
