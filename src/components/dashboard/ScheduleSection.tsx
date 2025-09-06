'use client';

// local helpers to avoid cluttering parent
const pad = (n: number) => String(n).padStart(2, '0');
const localToday = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
const localNowHM = () => {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

type PlatformKey = 'instagram' | 'facebook';

type Schedule = Record<PlatformKey, { date: string; time: string; suggested?: boolean }>;

type Props = {
  connectedPlatforms: PlatformKey[];
  activePlatform: PlatformKey;
  setActivePlatform: (p: PlatformKey) => void;
  schedule: Schedule;
  setSchedule: React.Dispatch<React.SetStateAction<Schedule>>;
  suggestTime: (p: PlatformKey) => void;
};

export default function ScheduleSection({
  connectedPlatforms,
  activePlatform,
  setActivePlatform,
  schedule,
  setSchedule,
  suggestTime,
}: Props) {
  const today = localToday();
  const selected = schedule[activePlatform];
  const isToday = selected.date === today;
  const minTime = isToday ? localNowHM() : undefined;

  return (
    <section className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-5">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Step 4 - Schedule</h2>

      {/* Platform tabs */}
      <div className="mt-3 flex gap-2">
        {connectedPlatforms.map((p) => (
          <button
            key={p}
            onClick={() => setActivePlatform(p)}
            className={`rounded-md border px-3 py-1.5 text-sm capitalize ${
              activePlatform === p ? 'bg-indigo-600 text-white' : ''
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Per-platform pickers */}
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="md:col-span-1">
          <label className="text-xs text-gray-600 dark:text-gray-400">Date</label>
          <input
            type="date"
            value={selected.date}
            min={today}
            onChange={(e) => {
              const nextDate = e.target.value < today ? today : e.target.value;
              setSchedule((s) => {
                const prev = s[activePlatform];
                const nextTime =
                  nextDate === today && prev.time && prev.time < localNowHM()
                    ? localNowHM()
                    : prev.time;
                return {
                  ...s,
                  [activePlatform]: { ...prev, date: nextDate, time: nextTime, suggested: false },
                };
              });
            }}
            className="mt-1 w-full rounded-md border px-2 py-1.5 text-sm"
          />
        </div>
        <div className="md:col-span-1">
          <label className="text-xs text-gray-600 dark:text-gray-400">Time</label>
          <input
            type="time"
            value={selected.time}
            min={minTime}
            onChange={(e) => {
              const raw = e.target.value;
              const guarded = selected.date === today && raw < localNowHM() ? localNowHM() : raw;
              setSchedule((s) => ({
                ...s,
                [activePlatform]: { ...s[activePlatform], time: guarded, suggested: false },
              }));
            }}
            className="mt-1 w-full rounded-md border px-2 py-1.5 text-sm"
          />
        </div>
        <div className="md:col-span-1 flex items-end">
          <button
            onClick={() => suggestTime(activePlatform)}
            className="w-full rounded-md border px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-white/10"
          >
            Suggest best time
          </button>
        </div>
      </div>

      <div className="mt-3 text-xs text-gray-600 dark:text-gray-400">
        {selected.suggested ? 'Suggested time applied — feel free to edit.' : 'Pick a date & time or use suggestion.'}
      </div>
    </section>
  );
}
