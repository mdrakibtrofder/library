import { useCallback, useState } from "react";

const KEY = "ri-library:recent";

const read = (): string[] => {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
};

/** Remembers the last few books opened on this device (best-effort). */
export const rememberBook = (id: string) => {
  try {
    const next = [id, ...read().filter((x) => x !== id)].slice(0, 8);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable */
  }
};

export function useRecent() {
  const [ids, setIds] = useState<string[]>(read);
  const clear = useCallback(() => {
    try { localStorage.removeItem(KEY); } catch { /* ignore */ }
    setIds([]);
  }, []);
  return { ids, clear };
}
