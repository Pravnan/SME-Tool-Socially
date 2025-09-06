'use client';

import { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, View } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Link from 'next/link';

// ✅ Define event type
type CalendarEvent = {
  _id?: string;
  title: string;
  start: Date;
  end: Date;
  resource: {
    platform: 'instagram' | 'facebook';
    status: 'scheduled' | 'posted';
    caption?: string;
    hashtags?: string[];
    imageUrl?: string;
  };
};

const localizer = momentLocalizer(moment);

export default function HistoryPage() {
  const [view, setView] = useState<'month' | 'week'>('week');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  // ✅ Fetch scheduled posts from API
  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch('/api/history');
        const data = await res.json();

        if (res.ok) {
          const mapped: CalendarEvent[] = data.posts.map((p: any) => ({
            _id: p._id,
            title: `${p.platform.toUpperCase()} Post`,
            start: new Date(p.scheduledAt),
            end: new Date(new Date(p.scheduledAt).getTime() + 30 * 60 * 1000),
            resource: {
              platform: p.platform,
              status: p.status,
              caption: p.caption,
              hashtags: p.hashtags,
              imageUrl: p.imageUrl,
            },
          }));
          setEvents(mapped);
        } else {
          console.error(data.error || 'Failed to load posts');
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadEvents();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* ✅ Top bar */}
      <div className="sticky top-0 z-20 border-b border-gray-200/70 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-white/5">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/dashboard" className="flex items-center gap-2">
            <img src="/assets/logo.svg" alt="Logo" className="h-8 w-auto" />
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg border px-3 py-2 text-sm bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* ✅ Main content */}
      <div className="mx-auto max-w-6xl px-4 py-6">
        <section className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Calendar of Posts
            </h2>
            {/* Inline legend */}
            <div className="flex gap-4 text-sm">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-indigo-600"></span>
                Scheduled
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                Posted
              </span>
            </div>
          </div>

          <div className="rounded-lg border bg-white dark:bg-gray-800 p-3">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              views={['month', 'week']}
              view={view}
              onView={(v: View) => setView(v as 'month' | 'week')}
              style={{ height: 600 }}
              eventPropGetter={(event: CalendarEvent) => {
                const bg =
                  event.resource.status === 'scheduled'
                    ? '#6366f1'
                    : '#22c55e';
                return { style: { backgroundColor: bg, color: 'white' } };
              }}
              onSelectEvent={(event) => setSelectedEvent(event)}
            />
          </div>
        </section>
      </div>

      {/* ✅ Modal for event details */}
      {selectedEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 px-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-md w-full shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
              onClick={() => setSelectedEvent(null)}
            >
              ✕
            </button>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              {selectedEvent.title}
            </h2>
            {selectedEvent.resource.imageUrl && (
              <img
                src={selectedEvent.resource.imageUrl}
                alt="Post preview"
                className="rounded-lg mb-4 w-full object-cover"
              />
            )}
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p>
                <strong>Platform:</strong> {selectedEvent.resource.platform}
              </p>
              <p>
                <strong>Status:</strong>{' '}
                <span
                  className={`px-2 py-0.5 rounded text-white text-xs ${
                    selectedEvent.resource.status === 'scheduled'
                      ? 'bg-indigo-600'
                      : 'bg-green-500'
                  }`}
                >
                  {selectedEvent.resource.status}
                </span>
              </p>
              {selectedEvent.resource.caption && (
                <p>
                  <strong>Caption:</strong> {selectedEvent.resource.caption}
                </p>
              )}
              {Array.isArray(selectedEvent.resource.hashtags) &&
                selectedEvent.resource.hashtags.length > 0 && (
                  <p>
                    <strong>Hashtags:</strong>{' '}
                    {selectedEvent.resource.hashtags.join(', ')}
                  </p>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
