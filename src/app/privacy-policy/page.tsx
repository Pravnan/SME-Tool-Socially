'use client';

import { FC } from 'react';

const PrivacyPolicy: FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4">
        Your privacy is important to us. This Privacy Policy explains how we
        collect, use, and safeguard your information when you use our services.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Information We Collect</h2>
      <p className="mb-4">
        We may collect personal data such as your name, email address, and usage
        activity to improve our services.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">How We Use Your Data</h2>
      <p className="mb-4">
        We use collected data to personalize your experience, provide support,
        and improve our platform.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us at
        <a href="mailto:support@socially.com" className="text-blue-500 hover:underline"> support@socially.com</a>.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
