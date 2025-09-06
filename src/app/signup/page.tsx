'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import GoogleSignInButton from '@/components/button/GoogleSignInButton';
import AppleSignInButton from '@/components/button/AppleSignInButton';
import PrimaryButton from '@/components/button/PrimaryButton';

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const name = String(form.get('name') || '').trim();
    const email = String(form.get('email') || '').trim();
    const password = String(form.get('password') || '');
    const confirm = String(form.get('confirm') || '');
    const terms = form.get('terms') === 'on';

    if (!name) return done('Please enter your full name.');
    if (!email) return done('Please enter your email.');
    if (password.length < 6) return done('Password must be at least 6 characters.');
    if (password !== confirm) return done('Passwords do not match.');
    if (!terms) return done('Please accept the terms to continue.');

    try {
      // Placeholder: we'll implement this API next
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Sign up failed.');
      }

      // Optional: auto-login after signup or redirect to login
      // Here we redirect to login with a success flag
      window.location.href = '/login?signup=success';
    } catch (err: any) {
      done(err.message || 'Something went wrong.');
    }

    function done(msg?: string) {
      if (msg) setErrors(msg);
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
      {/* Left: form */}
      <div className="flex flex-col justify-center px-6 sm:px-10 md:px-16 lg:px-24 py-12">
        <div className="w-full max-w-md mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center">
            Create your account
          </h2>

          {/* Social buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <GoogleSignInButton
              className="w-full"
              onClick={() =>
                signIn('google', {
                  callbackUrl: '/dashboard?signup=google',
                  prompt: 'select_account',
                })
              }
            />
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

          {/* Errors */}
          {errors && (
            <div className="mb-4 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errors}
            </div>
          )}

          {/* Form */}
          <form className="space-y-5" onSubmit={onSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm password
              </label>
              <input
                id="confirm"
                name="confirm"
                type="password"
                placeholder="••••••••"
                className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div className="flex items-start text-sm">
              <label className="flex items-center text-gray-600 dark:text-gray-400">
                <input name="terms" type="checkbox" className="mr-2 accent-blue-500" />
                I agree to the{' '}
                <Link href="#" className="ml-1 text-blue-600 hover:underline dark:text-blue-400">
                  Terms & Privacy
                </Link>
              </label>
            </div>

            <PrimaryButton type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account…' : 'Create account'}
            </PrimaryButton>
          </form>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-6 text-center">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:underline dark:text-blue-400">
              Log in
            </Link>
          </p>
        </div>
      </div>

      {/* Right: banner — identical to login for visual parity */}
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
