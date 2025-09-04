'use client';

type Props = {
  captionMode: 'ai' | 'manual';
  setCaptionMode: (m: 'ai' | 'manual') => void;
  aiCaptionOptions: string[];
  generateCaptions: () => void;
  caption: string;
  setCaption: (v: string) => void;
};

export default function CaptionsSection({
  captionMode,
  setCaptionMode,
  aiCaptionOptions,
  generateCaptions,
  caption,
  setCaption,
}: Props) {
  return (
    <section className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Step 2 - Captions</h2>
        <div className="inline-flex rounded-md border p-0.5">
          <button
            onClick={() => setCaptionMode('ai')}
            className={`px-3 py-1 text-sm rounded ${captionMode === 'ai' ? 'bg-indigo-600 text-white' : ''}`}
          >
            AI
          </button>
          <button
            onClick={() => setCaptionMode('manual')}
            className={`px-3 py-1 text-sm rounded ${captionMode === 'manual' ? 'bg-indigo-600 text-white' : ''}`}
          >
            Manual
          </button>
        </div>
      </div>

      {captionMode === 'ai' ? (
        <div className="mt-3 space-y-3">
          <button
            onClick={generateCaptions}
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50 dark:hover:bg-white/10"
          >
            Generate captions from image
          </button>
          {aiCaptionOptions.length === 0 ? (
            <p className="text-xs text-gray-600 dark:text-gray-400">No AI captions yet.</p>
          ) : (
            <div className="grid gap-2 md:grid-cols-2">
              {aiCaptionOptions.map((c, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCaption(c);
                    setCaptionMode('manual');
                  }}
                  className="rounded-lg border px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-white/10"
                >
                  {c}
                </button>
              ))}
            </div>
          )}
          <p className="text-xs text-gray-500">Tip: picking an option switches to “Manual” so you can edit it.</p>
        </div>
      ) : (
        <div className="mt-3 space-y-2">
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={4}
            placeholder="Edit or write your caption…"
            className="w-full rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 p-3 text-sm"
          />
          <div className="text-xs text-gray-500">Emojis & line breaks supported.</div>
        </div>
      )}
    </section>
  );
}
