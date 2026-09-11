import type { SparePart } from "../types/SparePart";

interface SparePartCardProps {
  part: SparePart;
  onDelete: (id: string) => void;
}

export default function SparePartCard({
  part,
  onDelete,
}: SparePartCardProps) {
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

  return (
    <article className="part-card">
      {part.image ? (
        <img src={part.image} alt={part.partName} />
      ) : (
        <div className="image-placeholder">No image</div>
      )}

      <div>
        <h3>{part.partName}</h3>
      </div>

      <div className="part-meta">
        <div>
          <strong>Machine:</strong> {part.machineCode}
        </div>
        <div>
          <strong>Part No:</strong> {part.partNumber}
        </div>
        <div>
          <strong>Category:</strong> {part.category}
        </div>
        <div>
          <strong>Location:</strong> {part.location}
        </div>
        <div>
          <strong>Supplier:</strong> {part.supplier}
        </div>
        <div>
          <strong>Quantity:</strong> {part.quantity}
        </div>
      </div>

      <span
        className="badge"
        style={{ backgroundColor: status.color }}
      >
        {status.label}
      </span>

      <div className="card-actions">
        <button
          type="button"
          className="danger-button"
          onClick={() => onDelete(part.id)}
        >
          Delete
        </button>
      </div>
    </article>
  );
}