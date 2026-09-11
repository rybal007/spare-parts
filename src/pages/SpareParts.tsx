import { useMemo, useState } from "react";

import { useSparePartStore } from "../store/sparePartStore";
import SparePartCard from "../components/SparePartCard";
import SearchBar from "../components/SearchBar";

type SortBy = "machineCode" | "quantity";
type SortDirection = "asc" | "desc";

export default function SpareParts() {
  const parts = useSparePartStore((s) => s.parts);
  const deletePart = useSparePartStore((s) => s.deletePart);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("machineCode");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const filtered = useMemo(() => {
    const query = search.toLowerCase();

    return parts.filter((part) => {
      return (
        (part.machine || "").toLowerCase().includes(query) ||
        (part.machineCode || "").toLowerCase().includes(query) ||
        (part.partNumber || "").toLowerCase().includes(query) ||
        (part.partName || "").toLowerCase().includes(query)
      );
    });
  }, [parts, search]);

  const sortedParts = useMemo(() => {
    const sorted = [...filtered];

    sorted.sort((a, b) => {
      const comparison =
        sortBy === "machineCode"
          ? (a.machineCode || "").localeCompare(b.machineCode || "")
          : (a.quantity ?? 0) - (b.quantity ?? 0);

      return sortDirection === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [filtered, sortBy, sortDirection]);

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

        <div className="sort-controls">
          <label htmlFor="sortBy" className="sort-label">
            Sort by
          </label>
          <select
            id="sortBy"
            className="sort-select"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as SortBy)}
          >
            <option value="machineCode">Machine code</option>
            <option value="quantity">No. of stocks</option>
          </select>

          <button
            type="button"
            className="secondary-button small-button"
            onClick={() =>
              setSortDirection((current) =>
                current === "asc" ? "desc" : "asc"
              )
            }
          >
            {sortDirection === "asc" ? "Ascending" : "Descending"}
          </button>
        </div>

        <span className="status-pill">{filtered.length} found</span>
      </div>

      {sortedParts.length === 0 ? (
        <div className="empty-state">No spare parts found for your current search.</div>
      ) : (
        <div className="content-grid">
          {sortedParts.map((part) => (
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