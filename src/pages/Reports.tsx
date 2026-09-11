import { useSparePartStore } from "../store/sparePartStore";

export default function Reports() {
  const parts = useSparePartStore((state) => state.parts);

  const totalParts = parts.length;

  const lowStock = parts.filter(
    (part) =>
      part.quantity > 0 &&
      part.quantity <= part.minStock
  ).length;

  const outOfStock = parts.filter(
    (part) => part.quantity === 0
  ).length;

  const totalQuantity = parts.reduce(
    (sum, part) => sum + part.quantity,
    0
  );

  return (
    <div style={{ padding: "20px" }}>
      <h1>Inventory Reports</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <div style={cardStyle}>
          <h2>{totalParts}</h2>
          <p>Total Spare Parts</p>
        </div>

        <div
          style={{
            ...cardStyle,
            backgroundColor: "#fef3c7",
          }}
        >
          <h2>{lowStock}</h2>
          <p>Low Stock Parts</p>
        </div>

        <div
          style={{
            ...cardStyle,
            backgroundColor: "#fee2e2",
          }}
        >
          <h2>{outOfStock}</h2>
          <p>Out of Stock</p>
        </div>

        <div
          style={{
            ...cardStyle,
            backgroundColor: "#dbeafe",
          }}
        >
          <h2>{totalQuantity}</h2>
          <p>Total Quantity</p>
        </div>
      </div>

      <h2 style={{ marginTop: "40px" }}>
        Parts Requiring Attention
      </h2>

      <table
        style={{
          width: "100%",
          marginTop: "15px",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th style={thStyle}>Machine</th>
            <th style={thStyle}>Part Number</th>
            <th style={thStyle}>Part Name</th>
            <th style={thStyle}>Quantity</th>
            <th style={thStyle}>Min Stock</th>
            <th style={thStyle}>Status</th>
          </tr>
        </thead>

        <tbody>
          {parts
            .filter(
              (part) =>
                part.quantity === 0 ||
                part.quantity <= part.minStock
            )
            .map((part) => (
              <tr key={part.id}>
                <td style={tdStyle}>
                  {part.machineCode}
                </td>
                <td style={tdStyle}>
                  {part.partNumber}
                </td>
                <td style={tdStyle}>
                  {part.partName}
                </td>
                <td style={tdStyle}>
                  {part.quantity}
                </td>
                <td style={tdStyle}>
                  {part.minStock}
                </td>
                <td style={tdStyle}>
                  {part.quantity === 0
                    ? "OUT OF STOCK"
                    : "LOW STOCK"}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  backgroundColor: "#f3f4f6",
  padding: "20px",
  borderRadius: "10px",
  textAlign: "center",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
};

const thStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: "12px",
  backgroundColor: "#2563eb",
  color: "white",
};

const tdStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: "10px",
};