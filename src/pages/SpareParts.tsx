import { useState } from "react";

import { useSparePartStore } from "../store/sparePartStore";
import SparePartCard from "../components/SparePartCard";
import SearchBar from "../components/SearchBar";

export default function SpareParts() {
  const parts = useSparePartStore((s) => s.parts);
  const deletePart = useSparePartStore((s) => s.deletePart);

  const [search, setSearch] = useState("");

  const filtered = parts.filter(
    (part) =>
      part.machineCode.toLowerCase().includes(search.toLowerCase()) ||
      part.partName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: 20 }}>
      <h1>Spare Parts List</h1>

      <SearchBar search={search} setSearch={setSearch} />

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {filtered.length === 0 ? (
          <p>No spare parts found.</p>
        ) : (
          filtered.map((part) => (
            <SparePartCard
              key={part.id}
              part={part}
              onDelete={deletePart}
            />
          ))
        )}
      </div>
    </div>
  );
}