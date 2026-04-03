'use client';

import { Component, ReactNode } from 'react';
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[var(--danger-subtle)] mb-4">
            <ExclamationTriangleIcon className="w-8 h-8 text-[var(--danger)]" />
          </div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
            Something went wrong
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-4 max-w-md">
            {this.state.error?.message || 'Failed to load dashboard data. Please try again.'}
          </p>
          <button
            onClick={this.handleRetry}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-[var(--bg)] rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            <ArrowPathIcon className="w-4 h-4" />
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ title = 'Error', message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--danger-subtle)] mb-3">
        <ExclamationTriangleIcon className="w-6 h-6 text-[var(--danger)]" />
      </div>
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">{title}</h3>
      <p className="text-sm text-[var(--text-secondary)] mb-3">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-3 py-1.5 bg-[var(--accent)] text-[var(--bg)] rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <ArrowPathIcon className="w-4 h-4" />
          Retry
        </button>
      )}
    </div>
  );
}
