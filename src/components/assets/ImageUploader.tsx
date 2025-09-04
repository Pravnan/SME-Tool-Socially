'use client';

import { useMemo } from 'react';

type Props = {
  files: File[];
  onChange: (files: File[]) => void;
};

export default function ImageUploader({ files, onChange }: Props) {
  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const incoming = Array.from(e.dataTransfer.files || []).filter((f) =>
      /image\/(png|jpe?g)/i.test(f.type)
    );
    if (incoming.length) onChange([...files, ...incoming]);
  }
  function onSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const incoming = Array.from(e.target.files || []).filter((f) =>
      /image\/(png|jpe?g)/i.test(f.type)
    );
    if (incoming.length) onChange([...files, ...incoming]);
  }
  function removeAt(i: number) {
    const next = [...files];
    next.splice(i, 1);
    onChange(next);
  }

  const previews = useMemo(
    () => files.map((f) => URL.createObjectURL(f)),
    [files]
  );

  return (
    <div>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 dark:border-white/10 p-6 text-center"
      >
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Drag & drop images here, or
        </p>
        <label className="mt-2 inline-block cursor-pointer rounded-md bg-gray-100 dark:bg-white/10 px-3 py-1.5 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-white/20">
          Browse
          <input type="file" accept="image/png,image/jpeg" multiple className="hidden" onChange={onSelect} />
        </label>
      </div>

      {files.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {files.map((f, i) => (
            <div key={i} className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previews[i]} alt={f.name} className="h-28 w-full object-cover" />
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute right-1.5 top-1.5 rounded bg-black/60 text-white text-xs px-2 py-0.5"
              >
                Remove
              </button>
              <div className="truncate p-2 text-xs text-gray-700 dark:text-gray-300">{f.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
