'use client';

import { useState } from 'react';
import { Calendar, momentLocalizer, View } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Link from 'next/link';

// ✅ Define event type
type CalendarEvent = {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resource: {
    platform: 'instagram' | 'facebook' | 'linkedin';
    status: 'scheduled' | 'posted';
    caption?: string;
    hashtags?: string[];
    imageUrl?: string;
  };
};

// ✅ Mock events
const events: CalendarEvent[] = [
  {
    id: 1,
    title: 'Instagram Post - Summer Sale',
    start: new Date(2025, 7, 28, 9, 0),
    end: new Date(2025, 7, 28, 9, 30),
    resource: {
      platform: 'instagram',
      status: 'scheduled',
      caption: '🔥 Big Summer Sale! Up to 50% off. Don’t miss it!',
      hashtags: ['#sale', '#summer', '#discount'],
      imageUrl: '/assets/sample1.jpg',
    },
  },
  {
    id: 2,
    title: 'Facebook Post - Product Launch',
    start: new Date(2025, 7, 29, 12, 0),
    end: new Date(2025, 7, 29, 12, 30),
    resource: {
      platform: 'facebook',
      status: 'posted',
      caption: '🚀 Our new product is live! Check it out now.',
      hashtags: ['#launch', '#newproduct', '#innovation'],
      imageUrl: '/assets/sample2.jpg',
    },
  },
];

const localizer = momentLocalizer(moment);

export default function HistoryPage() {
  const [view, setView] = useState<'month' | 'week'>('week');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* ✅ Top bar */}
      <div className="sticky top-0 z-20 border-b border-gray-200/70 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-white/5">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/dashboard" className="flex items-center gap-2">
            <img src="/assets/logo.svg" alt="Logo" className="h-8 w-auto" />
            <span className="hidden text-sm font-semibold text-gray-900 dark:text-white sm:inline">
            
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="rounded-lg border px-3 py-2 text-sm bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* ✅ Main layout */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 py-6 md:grid-cols-12">
        {/* Main column */}
        <div className="md:col-span-8 space-y-4">
          <section className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Calendar of Posts
            </h2>
            <div className="rounded-lg border bg-white dark:bg-gray-800 p-4">
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
                onSelectEvent={(event) => setSelectedEvent(event)} // ✅ click event
              />
            </div>
          </section>
        </div>

        {/* Right column */}
        <aside className="md:col-span-4 space-y-4">
          <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-5">
            <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-2">
              Legend
            </h3>
            <p className="text-sm">
              <span className="inline-block w-3 h-3 rounded-full bg-indigo-600 mr-2"></span>
              Scheduled Post
            </p>
            <p className="text-sm">
              <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
              Posted Post
            </p>
          </div>
        </aside>
      </div>

      {/* ✅ Modal for event details */}
      {selectedEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
              onClick={() => setSelectedEvent(null)}
            >
              ✕
            </button>
            <h2 className="text-lg font-semibold mb-2">{selectedEvent.title}</h2>
            {selectedEvent.resource.imageUrl && (
              <img
                src={selectedEvent.resource.imageUrl}
                alt="Post preview"
                className="rounded-lg mb-3"
              />
            )}
            <p className="text-sm mb-2">
              <strong>Platform:</strong> {selectedEvent.resource.platform}
            </p>
            <p className="text-sm mb-2">
              <strong>Status:</strong> {selectedEvent.resource.status}
            </p>
            <p className="text-sm mb-2">
              <strong>Caption:</strong> {selectedEvent.resource.caption}
            </p>
            <p className="text-sm">
              <strong>Hashtags:</strong>{' '}
              {selectedEvent.resource.hashtags?.join(', ')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
