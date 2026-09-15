import { useState } from "react";

import { useSparePartStore } from "../store/sparePartStore";
import ImageUploader from "./ImageUploader";
import type { SparePart } from "../types/SparePart";

interface SparePartCardProps {
  part: SparePart;
  onDelete: (id: string) => void;
}

export default function SparePartCard({
  part,
  onDelete,
}: SparePartCardProps) {
  const updatePart = useSparePartStore((s) => s.updatePart);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<SparePart>({ ...part });

  const getStatus = () => {
    if (part.quantity === 0) {
      return {
        label: "OUT OF STOCK",
        color: "#ef4444",
      };
    }

    if (part.quantity <= part.minStock) {
      return {
        label: "LOW STOCK",
        color: "#f59e0b",
      };
    }

    return {
      label: "AVAILABLE",
      color: "#22c55e",
    };
  };

  const status = getStatus();

  const startEditing = () => {
    setDraft({ ...part });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setDraft({ ...part });
    setIsEditing(false);
  };

  const saveEditing = () => {
    updatePart(draft);
    setIsEditing(false);
  };

  return (
    <article className="part-card">
      {part.image ? (
        <img src={part.image} alt={part.partName} />
      ) : (
        <div className="image-placeholder">No image</div>
      )}

      {isEditing ? (
        <div className="card-edit-form">
          <div className="card-image-editor">
            {draft.image ? (
              <img src={draft.image} alt={draft.partName || "Spare part image"} />
            ) : (
              <div className="image-placeholder small-placeholder">No image</div>
            )}
            <ImageUploader
              onImageUpload={(image) => setDraft({ ...draft, image })}
            />
          </div>

          <input
            className="card-field"
            value={draft.partName}
            onChange={(e) => setDraft({ ...draft, partName: e.target.value })}
          />
          <input
            className="card-field"
            value={draft.machine || draft.machineCode}
            onChange={(e) => setDraft({ ...draft, machine: e.target.value })}
          />
          <input
            className="card-field"
            value={draft.machineCode}
            onChange={(e) => setDraft({ ...draft, machineCode: e.target.value })}
          />
          <input
            className="card-field"
            value={draft.partNumber}
            onChange={(e) => setDraft({ ...draft, partNumber: e.target.value })}
          />
          <input
            className="card-field"
            value={draft.category}
            onChange={(e) => setDraft({ ...draft, category: e.target.value })}
          />
          <input
            className="card-field"
            type="number"
            min="0"
            value={draft.quantity}
            onChange={(e) =>
              setDraft({ ...draft, quantity: Number(e.target.value) })
            }
          />
          <input
            className="card-field"
            type="number"
            min="0"
            value={draft.minStock}
            onChange={(e) =>
              setDraft({ ...draft, minStock: Number(e.target.value) })
            }
          />
          <input
            className="card-field"
            value={draft.supplier}
            onChange={(e) => setDraft({ ...draft, supplier: e.target.value })}
          />
        </div>
      ) : (
        <>
          <div>
            <h3>{part.partName}</h3>
          </div>

          <div className="part-meta">
            <div>
              <strong>Machine:</strong> {part.machine || part.machineCode}
            </div>
            <div className="part-meta-row">
              <strong className="meta-label">Machine Code:</strong>
              <span className="machine-code-value">{part.machineCode}</span>
            </div>
            <div>
              <strong>Part No:</strong> {part.partNumber}
            </div>
            <div>
              <strong>Category:</strong> {part.category}
            </div>
            <div>
              <strong>Supplier:</strong> {part.supplier}
            </div>
            <div>
              <strong>Quantity:</strong> {part.quantity}
            </div>
          </div>
        </>
      )}

      <span
        className="badge"
        style={{ backgroundColor: status.color }}
      >
        {status.label}
      </span>

      <div className="card-actions">
        {isEditing ? (
          <>
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
          </>
        ) : (
          <>
            <button
              type="button"
              className="secondary-button small-button"
              onClick={startEditing}
            >
              Edit
            </button>
            <button
              type="button"
              className="danger-button small-button"
              onClick={() => onDelete(part.id)}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </article>
  );
}