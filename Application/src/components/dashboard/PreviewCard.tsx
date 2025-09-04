'use client';

type Props = {
  imageUrl?: string;
  caption: string;
  hashtags: string[];
};

export default function PreviewCard({ imageUrl, caption, hashtags }: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-5">
      <h3 className="text-sm font-semibold">Preview</h3>
      <div className="mt-3 rounded-lg border p-3 bg-gray-50 dark:bg-white/5">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="preview" className="w-full max-h-64 object-contain rounded-md" />
        ) : (
          <div className="h-40 flex items-center justify-center text-xs text-gray-500">No image</div>
        )}
        <div className="mt-3 text-sm whitespace-pre-wrap">
          {caption || <span className="text-gray-400">No caption</span>}
        </div>
        <div className="mt-2 text-xs text-gray-600">
          {hashtags.length ? hashtags.map((h) => `#${h}`).join(' ') : (
            <span className="text-gray-400">No hashtags</span>
          )}
        </div>
      </div>
    </div>
  );
}
