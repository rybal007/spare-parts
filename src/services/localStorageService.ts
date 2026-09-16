import type { SparePart } from "../types/SparePart";

const STORAGE_KEY = "spareParts";
const API_URL = "/api/parts";

const readFallbackParts = (): SparePart[] => {
  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) {
    return [];
  }

  try {
    return JSON.parse(data) as SparePart[];
  } catch (error) {
    console.error("Failed to load spare parts from fallback storage:", error);
    return [];
  }
};

const saveFallbackParts = (parts: SparePart[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(parts));
};

export const saveParts = (parts: SparePart[]): void => {
  saveFallbackParts(parts);
};

export const loadParts = async (): Promise<SparePart[]> => {
  try {
    const response = await fetch(API_URL, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return (await response.json()) as SparePart[];
  } catch (error) {
    console.warn("Falling back to localStorage for spare-part data:", error);
    return readFallbackParts();
  }
};

export const addPartToStorage = async (part: SparePart): Promise<SparePart> => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(part),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return (await response.json()) as SparePart;
  } catch (error) {
    console.warn("API save failed; storing locally instead:", error);
    const parts = readFallbackParts();
    const updatedParts = [...parts, part];
    saveFallbackParts(updatedParts);
    return part;
  }
};

export const deletePartFromStorage = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
  } catch (error) {
    console.warn("API delete failed; removing locally instead:", error);
    const parts = readFallbackParts();
    saveFallbackParts(parts.filter((part) => part.id !== id));
  }
};

export const updatePartInStorage = async (updatedPart: SparePart): Promise<SparePart> => {
  try {
    const response = await fetch(`${API_URL}/${updatedPart.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedPart),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return (await response.json()) as SparePart;
  } catch (error) {
    console.warn("API update failed; saving locally instead:", error);
    const parts = readFallbackParts();
    const updatedParts = parts.map((part) =>
      part.id === updatedPart.id ? updatedPart : part
    );
    saveFallbackParts(updatedParts);
    return updatedPart;
  }
};