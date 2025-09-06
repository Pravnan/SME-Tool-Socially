'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUploader from '@/components/assets/ImageUploader';

const MIN_IMAGES = 3;

type Step = 'idle' | 'uploading' | 'queuing' | 'finalizing' | 'done' | 'error';

export default function AssetsDashboardPage() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<Step>('idle');
  const [error, setError] = useState<string | null>(null);

  const imagesOk = files.length >= MIN_IMAGES;
  const canSubmit = imagesOk && !submitting;

  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);

    try {
      // 1) Upload images -> Wasabi
      setStep('uploading');
      const fd = new FormData();
      files.forEach((f) => fd.append('images', f));
      const upRes = await fetch('/api/assets/upload-images', { method: 'POST', body: fd });
      if (!upRes.ok) throw new Error(`Image upload failed: ${await upRes.text()}`);
      const { items: uploaded } = await upRes.json();

      // 2) Queue profile build job (GPU analyzer)
      setStep('queuing');
      const qRes = await fetch('/api/brand/profile/queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageKeys: uploaded?.map((x: any) => x.key) ?? [],
        }),
      });
      if (!qRes.ok) throw new Error(`Queue failed: ${await qRes.text()}`);

      // 3) Mark onboarding choice in DB
      setStep('finalizing');
      const choiceRes = await fetch('/api/onboarding/choice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ choice: 'assets' }),
      });
      if (!choiceRes.ok) throw new Error(`Onboarding choice update failed: ${await choiceRes.text()}`);

      // 4) Done → redirect
      setStep('done');
      router.push('/dashboard');
    } catch (e: any) {
      console.error(e);
      setError(e?.message || 'Something went wrong. Please try again.');
      setStep('error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Set the tone for your posts
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Add a few images that reflect the look and feel you like. This could be anything color palettes,
            past posts, or visuals that inspire you.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Image uploader */}
          <section className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-4 sm:p-6">
            <div className="flex items-baseline justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Style Samples</h2>
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                {files.length} selected • need at least {MIN_IMAGES}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              JPG or PNG. Add at least 3 images that capture your style, mood, or preferred colors.
            </p>
            <div className="mt-4">
              <ImageUploader files={files} onChange={setFiles} />
            </div>
          </section>
        </div>

        {/* status + errors */}
        <div className="mt-4">
          {error && (
            <div className="rounded-lg border border-red-300 bg-red-50 text-red-800 px-3 py-2 text-sm">
              {error}
            </div>
          )}
          {submitting && !error && (
            <div className="rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-800 px-3 py-2 text-sm">
              {step === 'uploading' && 'Uploading images to secure storage…'}
              {step === 'queuing' && 'Queuing brand profile job…'}
              {step === 'finalizing' && 'Finalizing onboarding…'}
            </div>
          )}
        </div>

        {/* bottom action bar */}
        <div className="sticky bottom-0 left-0 right-0 mt-8 border-t border-gray-200/70 dark:border-white/10 bg-white/80 dark:bg-[#0b1020]/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 p-4 sm:p-6 rounded-t-2xl">
          <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
              <span className={imagesOk ? 'text-green-600' : 'text-red-600'}>
                {imagesOk ? '✓' : '•'} At least {MIN_IMAGES} images
              </span>
            </div>
            <button
              disabled={!canSubmit}
              onClick={handleSubmit}
              className="w-full sm:w-auto rounded-lg bg-indigo-600 px-5 py-2.5 text-white font-medium disabled:opacity-50 hover:bg-indigo-700"
            >
              {submitting ? 'Getting started…' : 'Get started'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
