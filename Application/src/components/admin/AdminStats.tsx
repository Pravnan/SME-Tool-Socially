'use client';

import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

type Stats = {
  totalUsers: number;
  scheduledPosts: number;
  publishedPosts: number;
  imagesCreated: number;
  postsOverTime: { date: string; count: number }[];
  postsByPlatform: { platform: string; value: number }[];
};

const COLORS = ['#6366f1', '#22c55e', '#f97316', '#06b6d4'];

export default function AdminStats() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
  async function fetchStats() {
    const res = await fetch("/api/admin/stats");
    if (!res.ok) {
      console.error("Failed to fetch stats");
      return;
    }
    const data = await res.json();
    setStats(data);
  }
  fetchStats();
}, []);

  if (!stats) return <p>Loading stats...</p>;

  return (
    <div className="space-y-6">
      {/* 🔹 Top summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-lg border bg-white dark:bg-gray-800 p-4 shadow">
          <p className="text-sm text-gray-500">Total Users</p>
          <p className="text-2xl font-bold">{stats.totalUsers}</p>
        </div>
        <div className="rounded-lg border bg-white dark:bg-gray-800 p-4 shadow">
          <p className="text-sm text-gray-500">Scheduled Posts</p>
          <p className="text-2xl font-bold">{stats.scheduledPosts}</p>
        </div>
        <div className="rounded-lg border bg-white dark:bg-gray-800 p-4 shadow">
          <p className="text-sm text-gray-500">Published Posts</p>
          <p className="text-2xl font-bold">{stats.publishedPosts}</p>
        </div>
        <div className="rounded-lg border bg-white dark:bg-gray-800 p-4 shadow">
          <p className="text-sm text-gray-500">Images Created</p>
          <p className="text-2xl font-bold">{stats.imagesCreated}</p>
        </div>
      </div>

      {/* 🔹 Charts side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Line chart - posts over time */}
        <div className="rounded-lg border bg-white dark:bg-gray-800 p-4 shadow">
          <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
            Posts Over Time
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.postsOverTime}>
              <XAxis dataKey="date" stroke="#888" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart - posts by platform */}
        <div className="rounded-lg border bg-white dark:bg-gray-800 p-4 shadow">
          <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
            Posts by Platform
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.postsByPlatform}
                dataKey="value"
                nameKey="platform"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {stats.postsByPlatform.map((entry, index) => (
                  <Cell key={entry.platform} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
