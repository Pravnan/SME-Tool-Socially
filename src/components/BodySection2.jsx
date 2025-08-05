'use client';

export default function BodySection2() {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
        
        {/* Section Heading */}
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
                <div key={index} className="text-center">
                <div className="flex justify-center items-center mb-4 w-10 h-10 mx-auto rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                    <feature.icon className="w-5 h-5 lg:w-6 lg:h-6 text-primary-600 dark:text-primary-300" />
                </div>
                <h3 className="mb-2 text-xl font-bold dark:text-white">{feature.title}</h3>
                <p className="text-gray-500 dark:text-gray-400">{feature.description}</p>
                </div>
            ))}

            </div>
      </div>
    </section>
  );
}

// Feature list with SVG icons as React components (inline)
const features = [
  {
    title: 'Marketing',
    description: 'Plan it, create it, launch it. Collaborate seamlessly with the organization and hit your marketing goals every month with our marketing plan.',
    icon: () => (
<svg
  fill="currentColor"
  viewBox="0 0 20 20"
  className="w-full h-full text-blue-600"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    fillRule="evenodd"
    d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"
    clipRule="evenodd"
  />
</svg>
    ),
  },
  {
    title: 'Legal',
    description: 'Protect your organization, devices and stay compliant with our structured workflows and custom permissions made for you.',
    icon: () => (
    <svg
  fill="currentColor"
  viewBox="0 0 20 20"
  className="w-full h-full text-blue-600"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    fillRule="evenodd"
    d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"
    clipRule="evenodd"
  />
</svg>
    ),
  },
  {
    title: 'Business Automation',
    description: 'Auto-assign tasks, send Slack messages, and much more. Power up with hundreds of templates to help you get started.',
    icon: () => (
      <svg
  fill="currentColor"
  viewBox="0 0 20 20"
  className="w-full h-full text-blue-600"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    fillRule="evenodd"
    d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"
    clipRule="evenodd"
  />
</svg>
    ),
  },
  // 🔁 Add the rest of the features similarly...
];
