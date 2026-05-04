"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { COMPARE_STORAGE_KEY, MAX_COMPARE } from "@/lib/compare";

type CompareContextValue = {
  selection: string[];
  isSelected: (slug: string) => boolean;
  toggle: (slug: string) => void;
  remove: (slug: string) => void;
  clear: () => void;
  canAddMore: boolean;
  max: number;
};

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [selection, setSelection] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage once on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(COMPARE_STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const cleaned = parsed
            .filter((s): s is string => typeof s === "string")
            .slice(0, MAX_COMPARE);
          if (cleaned.length > 0) setSelection(cleaned);
        }
      }
    } catch {
      // Corrupt JSON or storage unavailable — ignore.
    } finally {
      setHydrated(true);
    }
  }, []);

  // Persist after hydration so we don't overwrite stored value on first paint.
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(selection));
    } catch {
      // Quota / private mode — ignore.
    }
  }, [selection, hydrated]);

  const toggle = useCallback((slug: string) => {
    setSelection((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, slug];
    });
  }, []);

  const remove = useCallback((slug: string) => {
    setSelection((prev) => prev.filter((s) => s !== slug));
  }, []);

  const clear = useCallback(() => setSelection([]), []);

  const value = useMemo<CompareContextValue>(
    () => ({
      selection,
      isSelected: (slug) => selection.includes(slug),
      toggle,
      remove,
      clear,
      canAddMore: selection.length < MAX_COMPARE,
      max: MAX_COMPARE,
    }),
    [selection, toggle, remove, clear],
  );

  return (
    <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
  );
}

export function useCompare(): CompareContextValue {
  const ctx = useContext(CompareContext);
  if (!ctx) {
    throw new Error("useCompare must be used within <CompareProvider>");
  }
  return ctx;
}
