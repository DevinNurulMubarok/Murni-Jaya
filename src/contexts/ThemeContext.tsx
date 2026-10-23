import React, { createContext, useContext, useState, useEffect } from "react";

export type ThemeMode = "light" | "slate" | "amoled";

interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (theme: ThemeMode) => void;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem("themeMode") as ThemeMode) || "light";
  });

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem("themeMode", mode);
  };

  useEffect(() => {
    const root = document.documentElement;
    // Bersihkan class lama
    root.classList.remove("theme-light", "theme-slate", "theme-amoled", "dark");
    
    // Tambahkan class baru sesuai tema
    root.classList.add(`theme-${themeMode}`);
    if (themeMode !== "light") {
      root.classList.add("dark");
    }
  }, [themeMode]);

  const isDarkMode = themeMode !== "light";

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode, isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
