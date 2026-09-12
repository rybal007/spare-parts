import { useState } from "react";

import { useSparePartStore } from "../store/sparePartStore";
import type { SparePart } from "../types/SparePart";

export default function Inventory() {
  const parts = useSparePartStore((state) => state.parts);
  const updatePart = useSparePartStore((state) => state.updatePart);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<SparePart | null>(null);

  const getStatus = (quantity: number, minStock: number) => {
    if (quantity === 0) {
      return {
        text: "OUT OF STOCK",
        color: "#ef4444",
      };
    }

    if (quantity <= minStock) {
      return {
        text: "LOW STOCK",
        color: "#f59e0b",
      };
    }

    return {
      text: "AVAILABLE",
      color: "#22c55e",
    };
  };

  const startEditing = (part: SparePart) => {
    setEditingId(part.id);
    setDraft({ ...part });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setDraft(null);
  };

  const saveEditing = () => {
    if (!draft) return;

    updatePart({
      ...draft,
      updatedAt: new Date().toISOString(),
    });
    cancelEditing();
  };

  const sortedParts = [...parts].sort((a, b) => {
    const aTime = new Date(a.updatedAt || a.createdAt || 0).getTime();
    const bTime = new Date(b.updatedAt || b.createdAt || 0).getTime();
    return bTime - aTime;
  });

  return (
    <div className="page-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">Live monitoring</p>
          <h1 className="page-title">Inventory Monitoring</h1>
        </div>
      </header>

      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Machine</th>
              <th>Machine Code</th>
              <th>Part Number</th>
              <th>Part Name</th>
              <th>Quantity</th>
              <th>Minimum</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {sortedParts.map((part) => {
              const status = getStatus(part.quantity, part.minStock);
              const isEditing = editingId === part.id && draft;
              const displayDate = new Date(
                part.updatedAt || part.createdAt
              ).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              });

              return (
                <tr key={part.id}>
                  <td>
                    {isEditing ? (
                      <input
                        className="table-input"
                        value={draft.machine || draft.machineCode}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            machine: e.target.value,
                          })
                        }
                      />
                    ) : (
                      part.machine || part.machineCode
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        className="table-input"
                        value={draft.machineCode}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            machineCode: e.target.value,
                          })
                        }
                      />
                    ) : (
                      part.machineCode
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        className="table-input"
                        value={draft.partNumber}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            partNumber: e.target.value,
                          })
                        }
                      />
                    ) : (
                      part.partNumber
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        className="table-input"
                        value={draft.partName}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            partName: e.target.value,
                          })
                        }
                      />
                    ) : (
                      part.partName
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        className="table-input"
                        type="number"
                        min="0"
                        value={draft.quantity}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            quantity: Number(e.target.value),
                          })
                        }
                      />
                    ) : (
                      part.quantity
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        className="table-input"
                        type="number"
                        min="0"
                        value={draft.minStock}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            minStock: Number(e.target.value),
                          })
                        }
                      />
                    ) : (
                      part.minStock
                    )}
                  </td>
                  <td>{displayDate}</td>
                  <td>
                    <span
                      className="status-text"
                      style={{ color: status.color }}
                    >
                      {status.text}
                    </span>
                  </td>
                  <td>
                    {isEditing ? (
                      <div className="table-actions">
                        <button
                          type="button"
                          className="primary-button small-button"
                          onClick={saveEditing}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className="secondary-button small-button"
                          onClick={cancelEditing}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="secondary-button small-button"
                        onClick={() => startEditing(part)}
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}