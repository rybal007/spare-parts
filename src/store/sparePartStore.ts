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
}));