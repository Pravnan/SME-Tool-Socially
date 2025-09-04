'use client';

import { FC } from 'react';

const TermsAndConditions: FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
      <p className="mb-4">
        These Terms and Conditions govern your use of our website and services.
        By accessing or using our platform, you agree to these terms.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Use of Service</h2>
      <p className="mb-4">
        You agree not to misuse our services or engage in activities that may
        harm other users or the platform.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Intellectual Property</h2>
      <p className="mb-4">
        All content, trademarks, and data provided on this site are the property
        of Socially™ and protected by law.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Termination</h2>
      <p className="mb-4">
        We may suspend or terminate your access if you violate these terms.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Contact</h2>
      <p>
        For any questions regarding these terms, please contact us at
        <a href="mailto:legal@socially.com" className="text-blue-500 hover:underline"> legal@socially.com</a>.
      </p>
    </div>
  );
};

export default TermsAndConditions;
