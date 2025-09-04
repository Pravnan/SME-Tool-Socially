'use client';

import { useRef, useState, useEffect } from 'react';
import { X } from 'lucide-react';

type Props = {
  prompt: string;
  setPrompt: (v: string) => void;
  imageUrl?: string;
  onGenerateImage: () => Promise<void>; // make async
  onUploadImage: (file: File) => void;
  onRemoveImage?: () => void;
};

export default function ImageCreatorSection({
  prompt,
  setPrompt,
  imageUrl,
  onGenerateImage,
  onUploadImage,
  onRemoveImage,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ⏳ new state
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Idle');

  const messages = [
    'Starting your image…',
    'Cooking up your design 🍳',
    'Adding final touches ✨',
    'Almost there 🚀',
  ];

  useEffect(() => {
    if (isGenerating) {
      setProgress(0);
      let pct = 0;
      const interval = setInterval(() => {
        pct += Math.floor(Math.random() * 15) + 5; // 5–20% jumps
        if (pct >= 95) {
          pct = 95; // hold at 95% until API finishes
        }
        setProgress(pct);
        setStatus(messages[Math.min(Math.floor(pct / 25), messages.length - 1)]);
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setProgress(0);
      setStatus('Idle');
    }
  }, [isGenerating]);

  async function handleGenerate() {
    setIsGenerating(true);
    try {
      await onGenerateImage();
      setProgress(100);
      setStatus('Done 🎉');
    } catch (err) {
      console.error(err);
      setStatus('Failed ❌');
    } finally {
      setTimeout(() => setIsGenerating(false), 1500); // reset after short delay
    }
  }

  function handleRemove() {
    if (onRemoveImage) onRemoveImage();
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // reset file input
    }
  }

  return (
    <section className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-5">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        Step 1 - Create your image
      </h2>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
        Generate from a prompt or upload your own. Style follows your brand.
      </p>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="md:col-span-2 space-y-3">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            placeholder="e.g., Minimal product shot on a pastel background with soft shadows"
            className="w-full rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 p-3 text-sm"
            disabled={isGenerating}
          />
          <div className="flex gap-2">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`rounded-md px-3 py-1.5 text-sm text-white ${
                isGenerating
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isGenerating ? 'Generating…' : 'Generate'}
            </button>
            <label
              className={`rounded-md border px-3 py-1.5 text-sm cursor-pointer ${
                isGenerating
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-50 dark:hover:bg-white/10'
              }`}
            >
              Upload JPG
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg"
                className="hidden"
                disabled={isGenerating}
                onChange={(e) =>
                  e.target.files?.[0] && onUploadImage(e.target.files[0])
                }
              />
            </label>
          </div>

          {/* ⏳ Progress bar */}
          {isGenerating && (
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">
                {status} ({progress}%)
              </p>
            </div>
          )}
        </div>

        <div className="relative rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-2 flex items-center justify-center">
          {imageUrl ? (
            <>
              <img
                src={imageUrl}
                alt="Preview"
                className="max-h-40 object-contain rounded"
              />
              <button
                type="button"
                onClick={handleRemove}
                disabled={isGenerating}
                className="absolute top-2 right-2 bg-white/80 dark:bg-black/50 rounded-full p-1 hover:bg-red-500 hover:text-white transition"
              >
                <X size={16} />
              </button>
            </>
          ) : (
            <span className="text-xs text-gray-500">No image yet</span>
          )}
        </div>
      </div>
    </section>
  );
}
