'use client';

import Link from 'next/link';
import { FC } from 'react';

const Footer: FC = () => {
  return (
    <footer className="p-4 bg-white md:p-8 lg:p-10 dark:bg-gray-800">
      <div className="mx-auto max-w-screen-xl text-center">
        <Link
          href="/"
          className="flex justify-center items-center text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <img
            src="/assets/logo.svg"
            alt="Logo"
            className="h-10 mr-2"
          />
        </Link>

        <p className="my-6 text-gray-500 dark:text-gray-400">
          We bring intelligence to social media management. Automate tasks and focus on what truly matters — your audience.
        </p>

        <ul className="flex flex-wrap justify-center items-center mb-6 text-gray-900 dark:text-white">
          {[
            { label: 'Privacy Policy', href: '/privacy-policy' },
            { label: 'Terms & Conditions', href: '/terms-and-conditions' },
            { label: 'Contact Us', href: '/contact' },
            { label: 'Newsletter', href: '/newsletter' },
            { label: 'Blog', href: '/blog' },
            { label: 'Affiliate Program', href: '/affiliate' },
            { label: 'FAQs', href: '/faqs' },
          ].map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="mr-4 hover:underline md:mr-6"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2025 <Link href="/" className="hover:underline">Socially™</Link>. All Rights Reserved | Dev & Designed by praveenan.
        </span>
        
      </div>
    </footer>
  );
};

export default Footer;
