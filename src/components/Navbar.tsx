import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav
      style={{
        background: "#2563eb",
        color: "white",
        padding: "15px",
      }}
    >
      <Link to="/" style={{ color: "white", marginRight: 20 }}>
        Dashboard
      </Link>

      <Link
        to="/parts"
        style={{ color: "white", marginRight: 20 }}
      >
        Spare Parts
      </Link>

      <Link to="/add" style={{ color: "white" }}>
        Add Part
      </Link>
      <Link
  to="/inventory"
  style={{ color: "white", marginRight: 20 }}
>
  Inventory
</Link>
<Link
  to="/reports"
  style={{ color: "white", marginRight: 20 }}
>
  Reports
</Link>
    </nav>
  );
}
``