import { useSparePartStore } from "../store/sparePartStore";

export default function Dashboard() {
  const parts = useSparePartStore((s) => s.parts);

  const lowStock = parts.filter(
    (p) => p.quantity <= p.minStock
  ).length;

  const outOfStock = parts.filter(
    (p) => p.quantity === 0
  ).length;

  return (
    <div style={{ padding: 20 }}>
      <h1>Spare Parts Dashboard</h1>

      <div
        style={{
          display: "flex",
          gap: 20,
          marginTop: 20,
        }}
      >
        <div style={card}>
          <h2>{parts.length}</h2>
          <p>Total Parts</p>
        </div>

        <div style={card}>
          <h2>{lowStock}</h2>
          <p>Low Stock</p>
        </div>

        <div style={card}>
          <h2>{outOfStock}</h2>
          <p>Out Of Stock</p>
        </div>
      </div>
    </div>
  );
}

const card = {
  padding: 20,
  width: 200,
  background: "#f3f4f6",
  borderRadius: 10,
};
``