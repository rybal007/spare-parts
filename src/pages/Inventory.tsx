import { useSparePartStore } from "../store/sparePartStore";

export default function Inventory() {
  const parts = useSparePartStore((state) => state.parts);

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

  return (
    <div style={{ padding: "20px" }}>
      <h1>Inventory Monitoring</h1>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
        }}
      >
        <thead>
          <tr>
            <th style={thStyle}>Machine</th>
            <th style={thStyle}>Part Number</th>
            <th style={thStyle}>Part Name</th>
            <th style={thStyle}>Quantity</th>
            <th style={thStyle}>Minimum</th>
            <th style={thStyle}>Status</th>
          </tr>
        </thead>

        <tbody>
          {parts.map((part) => {
            const status = getStatus(part.quantity, part.minStock);

            return (
              <tr key={part.id}>
                <td style={tdStyle}>{part.machineCode}</td>
                <td style={tdStyle}>{part.partNumber}</td>
                <td style={tdStyle}>{part.partName}</td>
                <td style={tdStyle}>{part.quantity}</td>
                <td style={tdStyle}>{part.minStock}</td>
                <td style={{ ...tdStyle, color: status.color, fontWeight: 700 }}>
                  {status.text}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: "12px",
  backgroundColor: "#2563eb",
  color: "white",
  textAlign: "left",
};

const tdStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: "10px",
};