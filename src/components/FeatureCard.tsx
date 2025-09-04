'use client';

import { ElementType } from 'react';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

interface FeatureCardProps {
  icon: ElementType;
  title: string;
  description: string;
  link?: string;
}

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  link = '#',
}: FeatureCardProps) {
  return (
    <div className="text-center bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 h-full flex flex-col justify-between">
      <div>
        <div className="flex justify-center items-center mb-4 w-12 h-12 mx-auto rounded-full bg-blue-100 dark:bg-blue-900">
          <Icon className="w-6 h-6 text-blue-600 dark:text-blue-300" />
        </div>
        <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </div>

      <div className="mt-4">
        <Link
          href={link}
          className="inline-flex items-center text-blue-600 hover:underline font-medium dark:text-blue-400 group"
        >
          Learn more
                    <ArrowRightIcon
            className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1"
            strokeWidth={2.5} // default is 1.5
/>
        </Link>
      </div>
    </div>
  );
}
