'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type TimeFormat = '12h' | '24h';

interface SettingsContextType {
  timeFormat: TimeFormat;
  toggleTimeFormat: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [timeFormat, setTimeFormat] = useState<TimeFormat>('12h');

  useEffect(() => {
    const savedFormat = localStorage.getItem('timeFormat') as TimeFormat;
    if (savedFormat) {
      setTimeFormat(savedFormat);
    }
  }, []);

  const toggleTimeFormat = () => {
    const newFormat = timeFormat === '12h' ? '24h' : '12h';
    setTimeFormat(newFormat);
    localStorage.setItem('timeFormat', newFormat);
  };

  return (
    <SettingsContext.Provider value={{ timeFormat, toggleTimeFormat }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
