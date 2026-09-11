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

export const useSparePartStore = create<Store>((set) => ({
  parts: loadParts(),

  addPart: (part) => {
    addPartToStorage(part);

    set((state) => ({
      parts: [...state.parts, part],
    }));
  },

  deletePart: (id) => {
    deletePartFromStorage(id);

    set((state) => ({
      parts: state.parts.filter(
        (part) => part.id !== id
      ),
    }));
  },

  updatePart: (part) => {
    const existing = loadParts();
    const updatedParts = existing.map((item) =>
      item.id === part.id ? part : item
    );

    localStorage.setItem("spareParts", JSON.stringify(updatedParts));

    set((state) => ({
      parts: state.parts.map((item) =>
        item.id === part.id ? part : item
      ),
    }));
  },
}));