import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/parts", label: "Spare Parts" },
  { to: "/add", label: "Add Part" },
  { to: "/inventory", label: "Inventory" },
  { to: "/reports", label: "Reports" },
];

export default function Navbar() {
  return (
    <nav className="top-nav">
      <div className="nav-inner">
        <div className="brand-block">
          <div className="brand-mark">SP</div>
          <div>
            <div className="brand-name">SpareParts</div>
            <div className="brand-subtitle">Operations Suite</div>
          </div>
        </div>

        <div className="nav-links">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
``