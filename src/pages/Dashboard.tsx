import { useState } from "react";

import { useSparePartStore } from "../store/sparePartStore";

type AlertKey = "critical" | "watch" | "healthy" | null;

export default function Dashboard() {
  const parts = useSparePartStore((s) => s.parts);
  const [selectedAlert, setSelectedAlert] = useState<AlertKey>("critical");

  const criticalItems = parts.filter((p) => p.quantity === 0);
  const watchItems = parts.filter((p) => p.quantity > 0 && p.quantity <= p.minStock);
  const healthyItems = parts.filter((p) => p.quantity > p.minStock);
  const lowStock = watchItems.length;
  const outOfStock = criticalItems.length;
  const totalQuantity = parts.reduce((sum, part) => sum + part.quantity, 0);

  const selectedItems =
    selectedAlert === "critical"
      ? criticalItems
      : selectedAlert === "watch"
        ? watchItems
        : selectedAlert === "healthy"
          ? healthyItems
          : [];

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
          <button
            type="button"
            className={`summary-item ${selectedAlert === "critical" ? "selected" : ""}`}
            onClick={() => setSelectedAlert("critical")}
          >
            <div>
              <span className="alert-dot danger" />
              <strong>Critical items</strong>
            </div>
            <span>{outOfStock} parts require immediate replenishment</span>
          </button>

          <button
            type="button"
            className={`summary-item ${selectedAlert === "watch" ? "selected" : ""}`}
            onClick={() => setSelectedAlert("watch")}
          >
            <div>
              <span className="alert-dot warning" />
              <strong>Watch list</strong>
            </div>
            <span>{lowStock} items are at or below minimum stock</span>
          </button>

          <button
            type="button"
            className={`summary-item ${selectedAlert === "healthy" ? "selected" : ""}`}
            onClick={() => setSelectedAlert("healthy")}
          >
            <div>
              <span className="alert-dot success" />
              <strong>Healthy stock</strong>
            </div>
            <span>{healthyItems.length} items are in a good range</span>
          </button>
        </div>

        {selectedItems.length > 0 && (
          <div className="alert-details">
            <h3>{selectedAlert === "critical" ? "Critical items" : selectedAlert === "watch" ? "Watch list" : "Healthy stock"}</h3>
            <ul>
              {selectedItems.map((part) => (
                <li key={part.id}>
                  <strong>{part.partName}</strong> — {part.machineCode || part.machine || "No machine"} ({part.quantity} in stock)
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
``