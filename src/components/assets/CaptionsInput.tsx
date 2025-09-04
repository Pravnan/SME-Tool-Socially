'use client';

import { useEffect, useMemo, useState } from 'react';

type Props = {
  value: string[];
  onChange: (val: string[]) => void;
};

export default function CaptionsInput({ value, onChange }: Props) {
  const [raw, setRaw] = useState('');

  // hydrate textarea from parent if needed (rare)
  useEffect(() => {
    if (value.length && !raw) setRaw(value.join('\n'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const parsed = useMemo(() => {
    const lines = raw
      .split(/\r?\n/)
      .map((s) => s.replace(/\s+/g, ' ').trim())
      .filter((s) => s.length >= 8 && s.length <= 400);
    // dedupe
    const set = new Set<string>(); const out: string[] = [];
    for (const l of lines) { if (!set.has(l)) { set.add(l); out.push(l); } }
    return out;
  }, [raw]);

  useEffect(() => {
    onChange(parsed);
  }, [parsed, onChange]);

  return (
    <div className="space-y-2">
      <textarea
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        rows={8}
        placeholder="Paste or write one caption per line…"
        className="w-full rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 p-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <div className="text-xs text-gray-600 dark:text-gray-400">
        We keep {parsed.length} valid, unique captions (8–400 characters each).
      </div>
    </div>
  );
}
