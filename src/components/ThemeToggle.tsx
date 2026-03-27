'use client';
import { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export default function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    if (newDarkMode) {
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
      className="p-2 rounded-lg bg-m3-surface hover:bg-m3-surface-variant transition-colors"
      aria-label="Toggle Theme"
    >
      {isDarkMode ? (
        <SunIcon className="w-5 h-5 text-m3-on-surface" />
      ) : (
        <MoonIcon className="w-5 h-5 text-m3-on-surface" />
      )}
    </button>
  );
}
