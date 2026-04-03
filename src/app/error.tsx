'use client';

import Link from 'next/link';
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[var(--danger-subtle)] mb-6">
        <ExclamationTriangleIcon className="w-10 h-10 text-[var(--danger)]" />
      </div>
      <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
        Something went wrong
      </h1>
      <p className="text-[var(--text-secondary)] mb-6 max-w-md">
        {error.message || 'Failed to load the dashboard. Please try again.'}
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-[var(--bg)] rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          <ArrowPathIcon className="w-4 h-4" />
          Try again
        </button>
        <Link
          href="/"
          className="px-4 py-2 border border-[var(--border)] text-[var(--text-primary)] rounded-lg font-medium hover:bg-[var(--surface)] transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
