'use client';
import { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDark(isDark);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-elevated)] hover:border-[var(--accent)] transition-all duration-200 shadow-sm hover:shadow-md"
      aria-label="Toggle Theme"
    >
      {isDark ? (
        <SunIcon className="w-5 h-5 text-amber-500" />
      ) : (
        <MoonIcon className="w-5 h-5 text-indigo-500" />
      )}
    </button>
  );
}
