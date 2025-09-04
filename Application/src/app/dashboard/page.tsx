// src/app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Dashboard components
import ConnectAccountsCard from '@/components/dashboard/ConnectAccountsCard';
import ImageCreatorSection from '@/components/dashboard/ImageCreatorSection';
import CaptionSelection from '@/components/dashboard/CaptionsSection';
import HashtagsSection from '@/components/dashboard/HashtagsSection';
import ScheduleSection from '@/components/dashboard/ScheduleSection';
import PreviewCard from '@/components/dashboard/PreviewCard';

type PlatformKey = 'instagram' | 'facebook';
const CONNECTED_PLATFORMS: PlatformKey[] = ['instagram', 'facebook'];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // 🚨 Redirect admins to /admin automatically
  useEffect(() => {
    if (status === 'loading') return; 
    if (session?.user?.role === 'admin') {
      router.replace('/admin');
    }
  }, [session, status, router]);

  // --- State ---
  const [imageUrl, setImageUrl] = useState<string | undefined>(); // signed preview URL
  const [imageKey, setImageKey] = useState<string | undefined>(); // permanent storage key
  const [prompt, setPrompt] = useState('');
  const [expandedPrompt, setExpandedPrompt] = useState('');
  const [generating, setGenerating] = useState(false);

  // captions
  const [aiCaptionOptions, setAiCaptionOptions] = useState<string[]>([]);
  const [captionMode, setCaptionMode] = useState<'ai' | 'manual'>('ai');
  const [caption, setCaption] = useState('');

  // hashtags
  const [hashtagMode, setHashtagMode] = useState<'ai' | 'manual'>('ai');
  const [aiHashtagOptions, setAiHashtagOptions] = useState<string[][]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);

  // scheduling
  const [activePlatform, setActivePlatform] = useState<PlatformKey>('instagram');
  const [schedule, setSchedule] = useState<
    Record<PlatformKey, { date: string; time: string; suggested?: boolean }>
  >({
    instagram: { date: '', time: '', suggested: false },
    facebook: { date: '', time: '', suggested: false },
  });

  // --- API handlers ---
  async function generateImage() {
    if (!prompt.trim()) return alert('Please enter a prompt.');
    setGenerating(true);
    setImageUrl(undefined);
    setImageKey(undefined);
    setExpandedPrompt('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intent: prompt }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Generate failed: ${txt}`);
      }

      const data = (await res.json()) as {
        ok: boolean;
        outputUrl?: string; // signed preview
        key?: string;       // permanent backend key
        profile?: unknown;
        expanded?: string;
        error?: string;
      };

      if (!data.ok) throw new Error(data.error || 'Generation failed');

      if (data.expanded) setExpandedPrompt(data.expanded);

      setImageUrl(data.outputUrl || undefined); // preview
      setImageKey(data.key || undefined);       // backend reference
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Failed to generate image');
    } finally {
      setGenerating(false);
    }
  }

  async function uploadImage(file: File) {
    try {
      const fd = new FormData();
      fd.append('image', file);

      const res = await fetch('/api/assets/upload-temp', {
        method: 'POST',
        body: fd,
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Upload failed: ${txt}`);
      }

      const { url, key } = await res.json();

      setImageUrl(url); // signed preview
      setImageKey(key); // permanent backend key
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Failed to upload image');
    }
  }

  async function generateCaptions() {
    if (!imageKey) return alert('Upload or generate an image first.');

    try {
      const res = await fetch('/api/assets/captions/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: imageKey }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Caption API failed: ${txt}`);
      }

      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'No captions returned');

      setAiCaptionOptions(data.captions);
      setCaptionMode('ai');
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Failed to generate captions');
    }
  }

  async function generateHashtags() {
    if (!caption.trim()) return alert('Write or pick a caption first.');

    try {
      const res = await fetch('/api/assets/hashtags/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caption }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Hashtag API failed: ${txt}`);
      }

      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Hashtag generation failed');

      setAiHashtagOptions(data.hashtags);
      setHashtagMode('ai');
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Failed to generate hashtags');
    }
  }

  async function suggestTime(p: PlatformKey) {
    // TODO: scheduling suggestion API
  }

  async function schedulePost() {
    if (!imageKey || !caption.trim()) return alert('Image and caption are required.');
    const sel = schedule[activePlatform];
    if (!sel.date || !sel.time) return alert('Pick a date and time.');
    const when = new Date(`${sel.date}T${sel.time}`);
    if (isNaN(when.getTime())) return alert('Invalid date/time.');
    if (when.getTime() < Date.now()) return alert('Please choose a future time.');
    // TODO: publishing API
  }

  if (session?.user?.role === 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Top bar */}
      <div className="sticky top-0 z-20 border-b border-gray-200/70 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-white/5">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/dashboard" className="flex items-center gap-2">
            <img src="/assets/logo.svg" alt="Logo" className="h-8 w-auto" />
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/history"
              className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-white/10"
            >
              History
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-white/10"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 py-6 md:grid-cols-12">
        {/* Main column */}
        <div className="md:col-span-8 space-y-4">
          <ImageCreatorSection
            prompt={prompt}
            setPrompt={setPrompt}
            imageUrl={imageUrl}
            onGenerateImage={generateImage}
            onUploadImage={uploadImage}
            onRemoveImage={() => {
              setImageUrl(undefined);
              setImageKey(undefined);
            }}
          />

          {/* ✅ Show expanded prompt */}
          {expandedPrompt && (
            <div className="rounded-md bg-gray-100 dark:bg-gray-800 p-3 text-sm text-gray-800 dark:text-gray-200">
              <strong>Expanded Prompt:</strong>
              <p className="mt-1 whitespace-pre-line">{expandedPrompt}</p>
            </div>
          )}

          <CaptionSelection
            captionMode={captionMode}
            setCaptionMode={setCaptionMode}
            aiCaptionOptions={aiCaptionOptions}
            generateCaptions={generateCaptions}
            caption={caption}
            setCaption={setCaption}
          />

          <HashtagsSection
            hashtagMode={hashtagMode}
            setHashtagMode={setHashtagMode}
            aiHashtagOptions={aiHashtagOptions}
            generateHashtags={generateHashtags}
            hashtags={hashtags}
            setHashtags={setHashtags}
          />

          <ScheduleSection
            connectedPlatforms={CONNECTED_PLATFORMS}
            activePlatform={activePlatform}
            setActivePlatform={setActivePlatform}
            schedule={schedule}
            setSchedule={setSchedule}
            suggestTime={suggestTime}
          />

          {/* Footer actions */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={schedulePost}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-white text-sm font-medium hover:bg-indigo-700"
            >
              Schedule
            </button>
            <button className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-white/10">
              Save draft
            </button>
            <button className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-white/10">
              Post now
            </button>
          </div>
        </div>

        {/* Right column */}
        <aside className="md:col-span-4 space-y-4">
          <ConnectAccountsCard />
          <PreviewCard imageUrl={imageUrl} caption={caption} hashtags={hashtags} />
        </aside>
      </div>
    </div>
  );
}
