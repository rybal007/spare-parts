import { create } from "zustand";
import type { SparePart } from "../types/SparePart";

import {
  loadParts,
  addPartToStorage,
  deletePartFromStorage,
  updatePartInStorage,
} from "../services/localStorageService";

interface Store {
  parts: SparePart[];
  initialize: () => Promise<void>;
  addPart: (part: SparePart) => Promise<void>;
  deletePart: (id: string) => Promise<void>;
  updatePart: (part: SparePart) => Promise<void>;
}

const normalizePart = (part: SparePart): SparePart => ({
  ...part,
  createdAt: part.createdAt || new Date().toISOString(),
  updatedAt: part.updatedAt || part.createdAt || new Date().toISOString(),
});

const normalizeParts = (parts: SparePart[]): SparePart[] =>
  parts.map((part) => normalizePart(part));

export const useSparePartStore = create<Store>((set) => ({
  parts: [],

  initialize: async () => {
    const storedParts = normalizeParts(await loadParts());
    set({ parts: storedParts });
  },

  addPart: async (part) => {
    const normalizedPart = normalizePart(part);
    await addPartToStorage(normalizedPart);

    set((state) => ({
      parts: [...state.parts, normalizedPart],
    }));
  },

  deletePart: async (id) => {
    await deletePartFromStorage(id);

    set((state) => ({
      parts: state.parts.filter((part) => part.id !== id),
    }));
  },

  updatePart: async (part) => {
    const updatedPart = normalizePart({
      ...part,
      updatedAt: new Date().toISOString(),
    });

    await updatePartInStorage(updatedPart);

    set((state) => ({
      parts: state.parts.map((item) =>
        item.id === updatedPart.id ? updatedPart : item
      ),
    }));
  },
}));

void useSparePartStore.getState().initialize();