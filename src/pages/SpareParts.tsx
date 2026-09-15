import { useMemo, useState } from "react";

import { useSparePartStore } from "../store/sparePartStore";
import SparePartCard from "../components/SparePartCard";
import SearchBar from "../components/SearchBar";

export default function SpareParts() {
  const parts = useSparePartStore((s) => s.parts);
  const deletePart = useSparePartStore((s) => s.deletePart);

  const [search, setSearch] = useState("");
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

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

  const groupedParts = useMemo(() => {
    const groups = new Map<
      string,
      { machineType: string; items: typeof filtered }
    >();

    filtered.forEach((part) => {
      const key = part.machineCode || "Unassigned";
      const existing = groups.get(key) ?? { machineType: part.machine || key, items: [] };

      groups.set(key, {
        machineType: existing.machineType || part.machine || key,
        items: [...existing.items, part],
      });
    });

    return Array.from(groups.entries())
      .map(([machineCode, group]) => [machineCode, group.machineType, group.items] as const)
      .sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  const toggleGroup = (machineCode: string) => {
    setOpenGroups((current) => ({
      ...current,
      [machineCode]: !(current[machineCode] ?? false),
    }));
  };

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
        <div className="folder-groups">
          {groupedParts.map(([machineCode, machineType, items]) => {
            const isOpen = openGroups[machineCode] ?? false;
            const showMachineName = machineType && machineType !== machineCode;
            const headerText = showMachineName
              ? `${machineType} (${machineCode})`
              : machineCode;

            return (
              <section key={machineCode} className="machine-group">
                <button
                  type="button"
                  className="folder-header"
                  onClick={() => toggleGroup(machineCode)}
                  aria-expanded={isOpen}
                >
                  <div className="folder-title-wrap">
                    <span className="folder-machine-code folder-machine-left">{machineCode}</span>
                    <h2 className={showMachineName ? "folder-header-title" : "folder-header-title folder-header-single"}>
                      {showMachineName ? (
                        <span className="folder-machine-name">{machineType}</span>
                      ) : (
                        null
                      )}
                    </h2>
                  </div>
                  <span className="folder-meta">
                    <span className="folder-count">{items.length}</span>
                    <span className="folder-chevron">
                      {isOpen ? "▾" : "▸"}
                    </span>
                  </span>
                </button>

                {isOpen && (
                  <div className="content-grid">
                    {items.map((part) => (
                      <SparePartCard
                        key={part.id}
                        part={part}
                        onDelete={deletePart}
                      />
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}