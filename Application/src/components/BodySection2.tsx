'use client';

import {
  ChartBarIcon,
  ShieldCheckIcon,
  BoltIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import FeatureCard from './FeatureCard'; // Adjust path as needed

export default function BodySection2() {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">

        {/* Section Header */}
        <div className="max-w-screen-md mb-8 lg:mb-16 mx-auto text-center">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
            Designed for business teams like yours
          </h2>
          <p className="text-gray-500 sm:text-xl dark:text-gray-400">
            Here at Flowbite we focus on markets where technology, innovation, and capital can unlock long-term value and drive economic growth.
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
    title: 'Marketing',
    description:
      'Plan it, create it, launch it. Collaborate seamlessly with your organization and hit your marketing goals every month.',
    icon: ChartBarIcon,
    link: '#',
  },
  {
    title: 'Legal',
    description:
      'Protect your organization and stay compliant with structured workflows and custom permissions made for you.',
    icon: ShieldCheckIcon,
    link: '#',
  },
  {
    title: 'Business Automation',
    description:
      'Auto-assign tasks, send Slack messages, and much more. Power up with hundreds of pre-built templates.',
    icon: BoltIcon,
    link: '#',
  },
  {
    title: 'Finance',
    description:
      'Audit-proof software built for critical financial operations like month-end close and quarterly budgeting.',
    icon: CurrencyDollarIcon,
    link: '#',
  },
  {
    title: 'Enterprise Design',
    description:
      'Craft delightful experiences for both marketing and product with real cross-company collaboration.',
    icon: BuildingOfficeIcon,
    link: '#',
  },
  {
    title: 'Operations',
    description:
      'Keep your company’s lights on with structured workflows built for efficient teams and individuals.',
    icon: Cog6ToothIcon,
    link: '#',
  },
];
