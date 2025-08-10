'use client';

import Link from 'next/link';
import { ButtonHTMLAttributes, ReactNode } from 'react';

type Url = string; // Optional: You can import `Url` from 'next/dist/shared/lib/router/router' for stricter typing

interface LinkButtonProps {
  href: string;
  children: ReactNode;
  className?: string;
}

interface NormalButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  href?: undefined;
  children: ReactNode;
  className?: string;
}

type PrimaryButtonProps = LinkButtonProps | NormalButtonProps;

export default function PrimaryButton(props: PrimaryButtonProps) {
  const baseClasses =
    'inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900';

  // ✅ If href is provided, render a Link
  if ('href' in props && typeof props.href === 'string') {
    return (
      <Link href={props.href}>
        <span className={`${baseClasses} ${props.className ?? ''}`}>
          {props.children}
          <svg
            className="ml-2 -mr-1 w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </Link>
    );
  }

  // ✅ Default to a <button>
  const { children, className, ...rest } = props;
  return (
    <button {...rest} className={`${baseClasses} ${className ?? ''}`}>
      {children}
      <svg
        className="ml-2 -mr-1 w-5 h-5"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
}
