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
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "15px",
        width: "300px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      }}
    >
      {part.image ? (
        <img
          src={part.image}
          alt={part.partName}
          style={{
            width: "100%",
            height: "150px",
            objectFit: "cover",
            borderRadius: "8px",
            background: "#f3f4f6",
            marginBottom: "10px",
          }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "150px",
            background: "#f3f4f6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "8px",
            marginBottom: "10px",
            color: "#6b7280",
          }}
        >
          No Image
        </div>
      )}

      <h3>{part.partName}</h3>

      <p>
        <strong>Machine:</strong> {part.machineCode}
      </p>

      <p>
        <strong>Part No:</strong> {part.partNumber}
      </p>

      <p>
        <strong>Category:</strong> {part.category}
      </p>

      <p>
        <strong>Location:</strong> {part.location}
      </p>

      <p>
        <strong>Supplier:</strong> {part.supplier}
      </p>

      <p>
        <strong>Quantity:</strong> {part.quantity}
      </p>

      <span
        style={{
          backgroundColor: status.color,
          color: "white",
          padding: "5px 10px",
          borderRadius: "5px",
          display: "inline-block",
          marginBottom: "10px",
        }}
      >
        {status.label}
      </span>

      <br />

      <button
        onClick={() => onDelete(part.id)}
        style={{
          backgroundColor: "#dc2626",
          color: "white",
          border: "none",
          padding: "10px",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Delete
      </button>
    </div>
  );
}