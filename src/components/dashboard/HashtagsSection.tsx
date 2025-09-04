'use client';

type Props = {
  hashtagMode: 'ai' | 'manual';
  setHashtagMode: (m: 'ai' | 'manual') => void;
  aiHashtagOptions: string[][];
  generateHashtags: () => void;
  hashtags: string[];
  setHashtags: (v: string[]) => void;
};

export default function HashtagsSection({
  hashtagMode,
  setHashtagMode,
  aiHashtagOptions,
  generateHashtags,
  hashtags,
  setHashtags,
}: Props) {
  return (
    <section className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Step 3 - Hashtags</h2>
        <div className="inline-flex rounded-md border p-0.5">
          <button
            onClick={() => setHashtagMode('ai')}
            className={`px-3 py-1 text-sm rounded ${hashtagMode === 'ai' ? 'bg-indigo-600 text-white' : ''}`}
          >
            AI
          </button>
          <button
            onClick={() => setHashtagMode('manual')}
            className={`px-3 py-1 text-sm rounded ${hashtagMode === 'manual' ? 'bg-indigo-600 text-white' : ''}`}
          >
            Manual
          </button>
        </div>
      </div>

      {hashtagMode === 'ai' ? (
        <div className="mt-3 space-y-3">
          <button
            onClick={generateHashtags}
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50 dark:hover:bg-white/10"
          >
            Generate hashtag sets from caption
          </button>

          {aiHashtagOptions.length === 0 ? (
            <p className="text-xs text-gray-600 dark:text-gray-400">No AI suggestions yet.</p>
          ) : (
            <div className="grid gap-2 md:grid-cols-2">
              {aiHashtagOptions.map((setArr, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setHashtags(setArr);
                    setHashtagMode('manual');
                  }}
                  className="text-left rounded-lg border px-3 py-2 hover:bg-gray-50 dark:hover:bg-white/10"
                >
                  <div className="flex flex-wrap gap-2">
                    {setArr.map((h, idx) => (
                      <span key={idx} className="rounded-full border px-2 py-0.5 text-xs">
                        #{h}
                      </span>
                    ))}
                  </div>
                  <div className="mt-1 text-[11px] text-gray-500">Click to use & edit</div>
                </button>
              ))}
            </div>
          )}

          <p className="text-xs text-gray-500">
            Tip: choosing a set switches to “Manual” so you can tweak chips freely.
          </p>
        </div>
      ) : (
        <div className="mt-3">
          <div className="flex flex-wrap gap-2">
            {hashtags.map((h, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 rounded-full border border-gray-300 dark:border-white/10 px-2 py-1 text-xs"
              >
                #{h}
                <button
                  onClick={() => setHashtags(hashtags.filter((_, i) => i !== idx))}
                  className="text-gray-500 hover:text-gray-800"
                  aria-label={`Remove hashtag ${h}`}
                >
                  ×
                </button>
              </span>
            ))}
            <input
              placeholder="Add hashtag"
              className="rounded-full border px-3 py-1 text-xs"
              onKeyDown={(e) => {
                const input = e.target as HTMLInputElement;
                const val = input.value.trim().replace(/^#/, '');
                if (e.key === 'Enter' && val) {
                  e.preventDefault();
                  if (!hashtags.includes(val)) setHashtags([...hashtags, val]);
                  input.value = '';
                }
              }}
            />
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Keep it relevant. Aim for 8–12 tags with a mix of broad and niche.
          </div>
        </div>
      )}
    </section>
  );
}
