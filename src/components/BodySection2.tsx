'use client';

import {
  PencilSquareIcon,
  HashtagIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  PhotoIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import FeatureCard from './FeatureCard'; // Adjust path as needed

export default function BodySection2() {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">

        <div className="max-w-screen-md mb-8 lg:mb-16 mx-auto text-center">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
            Designed & Developed for creators and businesses like yours
          </h2>
          <p className="text-gray-500 sm:text-xl dark:text-gray-400">
            Our AI-powered platform helps you generate captions, design visuals,
            schedule posts, and analyze performance everything you need to
            grow your brand on social media, all in one place.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              link={feature.link}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

const features = [
  {
    title: 'AI Caption Writing',
    description:
      'Generate engaging, brand-consistent captions in seconds with AI that understands your tone and style.',
    icon: PencilSquareIcon,
    link: '#',
  },
  {
    title: 'Smart Hashtags',
    description:
      'Discover trending and relevant hashtags automatically to maximize reach and engagement.',
    icon: HashtagIcon,
    link: '#',
  },
  {
    title: 'Scheduling & Automation',
    description:
      'Plan posts in advance and let our system automatically publish them at the best times.',
    icon: CalendarDaysIcon,
    link: '#',
  },
  {
    title: 'Performance Analytics',
    description:
      'Track likes, comments, shares, and reach with easy-to-read dashboards that guide your next move.',
    icon: ChartBarIcon,
    link: '#',
  },
  {
    title: 'AI Image Generation',
    description:
      'Create eye-catching visuals and resize them for different platforms no design skills required.',
    icon: PhotoIcon,
    link: '#',
  },
  {
    title: 'Team Collaboration',
    description:
      'Invite teammates, review drafts, and manage social campaigns together in one streamlined workspace.',
    icon: Cog6ToothIcon,
    link: '#',
  },
];
