'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FC } from 'react';

const Footer: FC = () => {
  return (
    <footer className="p-4 bg-white md:p-8 lg:p-10 dark:bg-gray-800">
      <div className="mx-auto max-w-screen-xl text-center">
            <Link href="/" className="flex justify-center items-center text-2xl font-semibold text-gray-900 dark:text-white">
                    <img
                        src="/assets/logo.svg"
                        alt="Logo"
                        className="h-10 mr-2"
                    />
            </Link>

        <p className="my-6 text-gray-500 dark:text-gray-400">
          We bring intelligence to social media management. Automate tasks and focus on what truly matters your audience.

        </p>

        <ul className="flex flex-wrap justify-center items-center mb-6 text-gray-900 dark:text-white">
          {[
            'Privacy Policy',
            'Contact Us',
            'Newsletter',
            'Blog',
            'Affiliate Program',
            'FAQs',
          ].map((item) => (
            <li key={item}>
              <Link
                href="/"
                className="mr-4 hover:underline md:mr-6"
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>

        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2025 <Link href="/" className="hover:underline">Socially™</Link>. All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
