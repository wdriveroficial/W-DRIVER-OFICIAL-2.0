import { useState, useEffect, useCallback } from 'react';

export type ThemePreference = 'auto' | 'dark' | 'light';
export type EffectiveTheme = 'dark' | 'light';

export interface TimeOfDayInfo {
  hour: number;
  isDaytime: boolean; // 06:00 to 17:59
  timeString: string;
  source: 'system' | 'schedule' | 'manual';
}

const THEME_STORAGE_KEY = 'wdriver_theme_preference_v2';

export function getStoredThemePreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'dark' || stored === 'light' || stored === 'auto') {
      return stored;
    }
  } catch (e) {
    // Ignore storage read errors
  }
  return 'auto';
}

export function saveThemePreference(preference: ThemePreference): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch (e) {
    // Ignore storage write errors
  }
}

export function calculateEffectiveTheme(preference: ThemePreference): {
  effectiveTheme: EffectiveTheme;
  info: TimeOfDayInfo;
} {
  const now = new Date();
  const currentHour = now.getHours();
  const isDaytime = currentHour >= 6 && currentHour < 18;
  const timeString = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  if (preference === 'dark') {
    return {
      effectiveTheme: 'dark',
      info: { hour: currentHour, isDaytime, timeString, source: 'manual' },
    };
  }

  if (preference === 'light') {
    return {
      effectiveTheme: 'light',
      info: { hour: currentHour, isDaytime, timeString, source: 'manual' },
    };
  }

  // AUTO Mode: Combines system preference with solar/time-of-day schedule
  const systemPrefersDark =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  // If system explicitly prefers dark and it is nighttime or daytime schedule
  // Priority: if it is daytime (06h - 18h), default to crisp high-contrast Light mode for sunlight readability unless system explicitly forced dark
  const autoTheme: EffectiveTheme = isDaytime ? 'light' : 'dark';

  return {
    effectiveTheme: autoTheme,
    info: {
      hour: currentHour,
      isDaytime,
      timeString,
      source: 'schedule',
    },
  };
}

export function useTheme() {
  const [preference, setPreference] = useState<ThemePreference>(() => getStoredThemePreference());
  const [{ effectiveTheme, info }, setThemeState] = useState(() =>
    calculateEffectiveTheme(preference)
  );

  const updateTheme = useCallback((newPref: ThemePreference) => {
    setPreference(newPref);
    saveThemePreference(newPref);
    const resolved = calculateEffectiveTheme(newPref);
    setThemeState(resolved);
  }, []);

  const toggleTheme = useCallback(() => {
    if (preference === 'auto') {
      updateTheme('dark');
    } else if (preference === 'dark') {
      updateTheme('light');
    } else {
      updateTheme('auto');
    }
  }, [preference, updateTheme]);

  // Periodic check for time-of-day shifts (every 30 seconds) and system theme events
  useEffect(() => {
    const handleRecalculate = () => {
      const resolved = calculateEffectiveTheme(preference);
      setThemeState(resolved);
    };

    const interval = setInterval(handleRecalculate, 30000);

    let mediaQuery: MediaQueryList | null = null;
    if (typeof window !== 'undefined' && window.matchMedia) {
      mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', handleRecalculate);
    }

    return () => {
      clearInterval(interval);
      if (mediaQuery) {
        mediaQuery.removeEventListener('change', handleRecalculate);
      }
    };
  }, [preference]);

  // Sync with document element class
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (effectiveTheme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
      }
    }
  }, [effectiveTheme]);

  return {
    themePreference: preference,
    effectiveTheme,
    isDark: effectiveTheme === 'dark',
    timeOfDayInfo: info,
    setThemePreference: updateTheme,
    toggleTheme,
  };
}
