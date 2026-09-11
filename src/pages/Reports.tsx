import { useSparePartStore } from "../store/sparePartStore";

export default function Reports() {
  const parts = useSparePartStore((state) => state.parts);

  const totalParts = parts.length;
  const lowStock = parts.filter(
    (part) => part.quantity > 0 && part.quantity <= part.minStock
  ).length;
  const outOfStock = parts.filter((part) => part.quantity === 0).length;
  const totalQuantity = parts.reduce((sum, part) => sum + part.quantity, 0);

  return (
    <div className="page-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">Insights</p>
          <h1 className="page-title">Inventory Reports</h1>
        </div>
      </header>

      <section className="report-grid">
        <div className="metric-card primary">
          <span className="label">Total spare parts</span>
          <h2>{totalParts}</h2>
        </div>

        <div className="metric-card warning">
          <span className="label">Low stock parts</span>
          <h2>{lowStock}</h2>
        </div>

        <div className="metric-card danger">
          <span className="label">Out of stock</span>
          <h2>{outOfStock}</h2>
        </div>

        <div className="metric-card success">
          <span className="label">Total quantity</span>
          <h2>{totalQuantity}</h2>
        </div>
      </section>

      <section className="panel summary-panel">
        <h2>Parts requiring attention</h2>

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Machine</th>
                <th>Part Number</th>
                <th>Part Name</th>
                <th>Quantity</th>
                <th>Min Stock</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {parts
                .filter((part) => part.quantity === 0 || part.quantity <= part.minStock)
                .map((part) => (
                  <tr key={part.id}>
                    <td>{part.machineCode}</td>
                    <td>{part.partNumber}</td>
                    <td>{part.partName}</td>
                    <td>{part.quantity}</td>
                    <td>{part.minStock}</td>
                    <td>
                      <span
                        className="status-text"
                        style={{
                          color: part.quantity === 0 ? "#ef4444" : "#f59e0b",
                        }}
                      >
                        {part.quantity === 0 ? "OUT OF STOCK" : "LOW STOCK"}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}