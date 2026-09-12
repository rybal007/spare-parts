import { create } from "zustand";
import type { SparePart } from "../types/SparePart";

import {
  loadParts,
  addPartToStorage,
  deletePartFromStorage,
} from "../services/localStorageService";

interface Store {
  parts: SparePart[];
  addPart: (part: SparePart) => void;
  deletePart: (id: string) => void;
  updatePart: (part: SparePart) => void;
}

const normalizePart = (part: SparePart): SparePart => ({
  ...part,
  createdAt: part.createdAt || new Date().toISOString(),
  updatedAt: part.updatedAt || part.createdAt || new Date().toISOString(),
});

const normalizeParts = (parts: SparePart[]): SparePart[] =>
  parts.map((part) => normalizePart(part));

export const useSparePartStore = create<Store>((set) => ({
  parts: normalizeParts(loadParts()),

  addPart: (part) => {
    const normalizedPart = normalizePart(part);
    addPartToStorage(normalizedPart);

    set((state) => ({
      parts: [...state.parts, normalizedPart],
    }));
  },

  deletePart: (id) => {
    deletePartFromStorage(id);

    set((state) => ({
      parts: state.parts.filter((part) => part.id !== id),
    }));
  },

  updatePart: (part) => {
    const updatedPart = normalizePart({
      ...part,
      updatedAt: new Date().toISOString(),
    });
    const existing = loadParts();
    const updatedParts = existing.map((item) =>
      item.id === updatedPart.id ? updatedPart : item
    );

    localStorage.setItem("spareParts", JSON.stringify(updatedParts));

    set((state) => ({
      parts: state.parts.map((item) =>
        item.id === updatedPart.id ? updatedPart : item
      ),
    }));
  },
}));