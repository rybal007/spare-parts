import { useState } from "react";

import { useSparePartStore } from "../store/sparePartStore";
import SparePartCard from "../components/SparePartCard";
import SearchBar from "../components/SearchBar";

export default function SpareParts() {
  const parts = useSparePartStore((s) => s.parts);
  const deletePart = useSparePartStore((s) => s.deletePart);

  const [search, setSearch] = useState("");

  const filtered = parts.filter((part) => {
    const query = search.toLowerCase();

    return (
      (part.machine || "").toLowerCase().includes(query) ||
      (part.machineCode || "").toLowerCase().includes(query) ||
      (part.partNumber || "").toLowerCase().includes(query) ||
      (part.partName || "").toLowerCase().includes(query)
    );
  });

  return (
    <div className="page-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">Catalog</p>
          <h1 className="page-title">Spare Parts List</h1>
        </div>
      </header>

      <div className="page-toolbar">
        <SearchBar search={search} setSearch={setSearch} />
        <span className="status-pill">{filtered.length} found</span>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">No spare parts found for your current search.</div>
      ) : (
        <div className="content-grid">
          {filtered.map((part) => (
            <SparePartCard
              key={part.id}
              part={part}
              onDelete={deletePart}
            />
          ))}
        </div>
      )}
    </div>
  );
}