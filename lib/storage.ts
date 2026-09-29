export const CALENDAR_KEY = "fathom-calendar";
export const CLIPS_KEY = "fathom-clips";
export const DONE_KEY = "fathom-actions-done";
export const TEMPLATE_KEY = "fathom-template";

export function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJson(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}
