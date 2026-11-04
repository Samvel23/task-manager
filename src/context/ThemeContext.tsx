"use client";

import {
  useEffect,
  useCallback,
  createContext,
  useEffectEvent,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export const THEME = {
  DARK: "dark",
  LIGHT: "light",
} as const;

export type TTheme = (typeof THEME)[keyof typeof THEME];

interface ThemeContextType {
  theme: TTheme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);

let fallbackTheme: TTheme = "dark";
const subscribers = new Set<() => void>();

const readStoredTheme = (): TTheme => {
  if (typeof window === "undefined") {
    return "dark";
  }

  try {
    const stored = localStorage.getItem("taskflow-theme");
    if (stored === "light" || stored === "dark") {
      fallbackTheme = stored;
      return stored;
    }
  } catch {
    return fallbackTheme;
  }
  return fallbackTheme;
};

const subscribeToTheme = (callback: () => void): (() => void) => {
  subscribers.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    subscribers.delete(callback);
    window.removeEventListener("storage", callback);
  };
};

const getServerTheme = (): TTheme => "dark";

const storeTheme = (theme: TTheme): void => {
  fallbackTheme = theme;
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem("taskflow-theme", theme);
  } catch {
    // Theme changes still work for this session when storage is unavailable.
  }
  subscribers.forEach((callback) => callback());
};

export const ThemeProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    readStoredTheme,
    getServerTheme,
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const syncThemeOnVisibility = useEffectEvent(() => {
    document.documentElement.setAttribute("data-theme", theme);
  });

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        syncThemeOnVisibility();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const toggleTheme = useCallback(() => {
    storeTheme(readStoredTheme() === "light" ? "dark" : "light");
  }, []);

  return (
    <ThemeContext value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext>
  );
};
