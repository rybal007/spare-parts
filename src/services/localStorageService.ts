import type { SparePart } from "../types/SparePart";

const STORAGE_KEY = "spareParts";

/**
 * Save all spare parts to Local Storage
 */
export const saveParts = (parts: SparePart[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(parts));
};

/**
 * Load spare parts from Local Storage
 */
export const loadParts = (): SparePart[] => {
  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) {
    return [];
  }

  try {
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to load spare parts:", error);
    return [];
  }
};

/**
 * Add a new spare part
 */
export const addPartToStorage = (part: SparePart): void => {
  const parts = loadParts();

  parts.push(part);

  saveParts(parts);
};

/**
 * Delete a spare part
 */
export const deletePartFromStorage = (id: string): void => {
  const parts = loadParts();

  const updatedParts = parts.filter(
    (part) => part.id !== id
  );

  saveParts(updatedParts);
};

/**
 * Update a spare part
 */
export const updatePartInStorage = (
  updatedPart: SparePart
): void => {
  const parts = loadParts();

  const updatedParts = parts.map((part) =>
    part.id === updatedPart.id
      ? updatedPart
      : part
  );

  saveParts(updatedParts);
};