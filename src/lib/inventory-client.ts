import type { InventoryItem } from "./inventory-types";

const STORAGE_KEY = "inventoryItems";

export const loadInventory = (fallback: InventoryItem[]): InventoryItem[] => {
  if (typeof window === "undefined") return fallback;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return fallback;
    return parsed as InventoryItem[];
  } catch {
    return fallback;
  }
};

export const saveInventory = (items: InventoryItem[]): void => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};
