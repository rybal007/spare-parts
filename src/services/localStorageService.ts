import type { SparePart } from "../types/SparePart";

const STORAGE_KEY = "spareParts";
const API_URL = "/api/parts";
const LOAD_RETRY_DELAYS = [250, 500, 1000, 2000];

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

const isApiAvailable = async (): Promise<boolean> => {
  try {
    const response = await fetch("/api/config", {
      headers: {
        Accept: "application/json",
      },
    });

    return response.ok;
  } catch {
    return false;
  }
};

export const saveParts = (parts: SparePart[]): void => {
  saveFallbackParts(parts);
};

export const loadParts = async (): Promise<SparePart[]> => {
  if (!(await isApiAvailable())) {
    return readFallbackParts();
  }

  for (let attempt = 0; attempt <= LOAD_RETRY_DELAYS.length; attempt += 1) {
    try {
      const response = await fetch(API_URL, {
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok && response.status < 500 && response.status !== 408 && response.status !== 429) {
        return readFallbackParts();
      }

      if (!response.ok) {
        throw new Error(`Temporary server error: ${response.status}`);
      }

      return (await response.json()) as SparePart[];
    } catch { 
      if (attempt === LOAD_RETRY_DELAYS.length) {
        return readFallbackParts();
      }

      await new Promise((resolve) => setTimeout(resolve, LOAD_RETRY_DELAYS[attempt]));
    }
  }

  return readFallbackParts();
};

export const addPartToStorage = async (part: SparePart): Promise<SparePart> => {
  if (!(await isApiAvailable())) {
    const parts = readFallbackParts();
    const updatedParts = [...parts, part];
    saveFallbackParts(updatedParts);
    return part;
  }

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
  } catch {
    const parts = readFallbackParts();
    const updatedParts = [...parts, part];
    saveFallbackParts(updatedParts);
    return part;
  }
};

export const deletePartFromStorage = async (id: string): Promise<void> => {
  if (!(await isApiAvailable())) {
    const parts = readFallbackParts();
    saveFallbackParts(parts.filter((part) => part.id !== id));
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
  } catch {
    const parts = readFallbackParts();
    saveFallbackParts(parts.filter((part) => part.id !== id));
  }
};

export const updatePartInStorage = async (updatedPart: SparePart): Promise<SparePart> => {
  if (!(await isApiAvailable())) {
    const parts = readFallbackParts();
    const updatedParts = parts.map((part) =>
      part.id === updatedPart.id ? updatedPart : part
    );
    saveFallbackParts(updatedParts);
    return updatedPart;
  }

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
  } catch {
    const parts = readFallbackParts();
    const updatedParts = parts.map((part) =>
      part.id === updatedPart.id ? updatedPart : part
    );
    saveFallbackParts(updatedParts);
    return updatedPart;
  }
};