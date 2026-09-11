import { useSparePartStore } from "../store/sparePartStore";

export default function Dashboard() {
  const parts = useSparePartStore((s) => s.parts);

  const lowStock = parts.filter((p) => p.quantity > 0 && p.quantity <= p.minStock).length;
  const outOfStock = parts.filter((p) => p.quantity === 0).length;
  const totalQuantity = parts.reduce((sum, part) => sum + part.quantity, 0);

  return (
    <div className="page-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">Operations overview</p>
          <h1 className="page-title">Spare Parts Dashboard</h1>
        </div>
        <span className="status-pill">Live inventory</span>
      </header>

      <section className="stat-grid">
        <div className="stat-card">
          <span className="label">Total parts</span>
          <h2>{parts.length}</h2>
        </div>

        <div className="stat-card">
          <span className="label">Low stock</span>
          <h2>{lowStock}</h2>
        </div>

        <div className="stat-card">
          <span className="label">Out of stock</span>
          <h2>{outOfStock}</h2>
        </div>

        <div className="stat-card">
          <span className="label">Total units</span>
          <h2>{totalQuantity}</h2>
        </div>
      </section>

      <section className="panel summary-panel">
        <div className="page-toolbar">
          <h2>Priority alerts</h2>
        </div>

        <div className="summary-list">
          <div className="summary-item">
            <div>
              <span className="alert-dot danger" />
              <strong>Critical items</strong>
            </div>
            <span>{outOfStock} parts require immediate replenishment</span>
          </div>

          <div className="summary-item">
            <div>
              <span className="alert-dot warning" />
              <strong>Watch list</strong>
            </div>
            <span>{lowStock} items are at or below minimum stock</span>
          </div>

          <div className="summary-item">
            <div>
              <span className="alert-dot success" />
              <strong>Healthy stock</strong>
            </div>
            <span>{parts.length - (lowStock + outOfStock)} items are in a good range</span>
          </div>
        </div>
      </section>
    </div>
  );
}
``