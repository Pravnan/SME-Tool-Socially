'use client';

import Image from 'next/image';
import PrimaryButton from '@/components/button/PrimaryButton'; // ✅ Adjust path as needed

export default function BodySection3() {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="grid gap-16 items-center py-12 px-4 mx-auto max-w-screen-xl lg:grid-cols-2 lg:py-20 lg:px-6">

        {/* Text Block */}
        <div>
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            We didn't reinvent the wheel
          </h2>
          <p className="mb-4 text-gray-600 sm:text-lg dark:text-gray-400">
            We are strategists, designers, and developers — innovators and problem solvers. Small enough to be agile, big enough to deliver impact at scale.
          </p>
          <p className="mb-6 text-gray-600 sm:text-lg dark:text-gray-400">
            Our team combines creativity and technology to help your business grow faster and smarter. Experience flexibility with results.
          </p>

          {/* ✅ Reusable Primary Button */}
          <PrimaryButton href="#">Get started</PrimaryButton>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="w-full">
            <Image
              src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/office-long-2.png"
              alt="Office space 1"
              className="rounded-lg"
              width={500}
              height={300}
            />
          </div>
          <div className="w-full mt-4 lg:mt-10">
            <Image
              src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/office-long-1.png"
              alt="Office space 2"
              className="rounded-lg"
              width={500}
              height={300}
            />
          </div>
        </div>

      </div>
    </section>
  );
}
