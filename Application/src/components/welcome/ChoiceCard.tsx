'use client';

import { MouseEventHandler, ReactNode } from 'react';

type ChoiceCardProps = {
  title: string;
  description: string;
  icon?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
};

export default function ChoiceCard({
  title,
  description,
  icon,
  onClick,
  className = '',
}: ChoiceCardProps) {
  return (
    <button
      onClick={onClick}
      className={`group w-full text-left rounded-2xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition 
                  hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 ${className}`}
    >
      <div className="flex items-start gap-4">
        {icon && <div className="text-2xl">{icon}</div>}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            {description}
          </p>
          <div className="mt-4 inline-flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
            Continue
            <svg
              className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l5.0 5a1 1 0 010 1.414l-5.0 5a1 1 0 01-1.414-1.414L13.586 10 10.293 6.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
              <path d="M3 10a1 1 0 011-1h10a1 1 0 110 2H4a1 1 0 01-1-1z" />
            </svg>
          </div>
        </div>
      </div>
    </button>
  );
}
