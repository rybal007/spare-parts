import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/parts", label: "Spare Parts" },
  { to: "/add", label: "Add Part" },
  { to: "/inventory", label: "Inventory" },
  { to: "/reports", label: "Reports" },
];

export default function Navbar() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [dataPath, setDataPath] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch("/api/config");

        if (!response.ok) {
          return;
        }

        const config = await response.json();
        setDataPath(config.dataPath || "");
      } catch (error) {
        console.warn("Unable to load database settings:", error);
      }
    };

    void loadSettings();
  }, []);

  const handleSave = async () => {
    try {
      const response = await fetch("/api/config", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dataPath }),
      });

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      const config = await response.json();
      setStatus(`Database path saved: ${config.dataPath}`);
      setDataPath(config.dataPath);
    } catch (error) {
      console.error(error);
      setStatus("Unable to save database path.");
    }
  };

  return (
    <nav className="top-nav">
      <div className="nav-inner">
        <div className="brand-block">
          <div className="brand-mark">SP</div>
          <div>
            <div className="brand-name">SpareParts</div>
            <div className="brand-subtitle">assembly maint</div>
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

          <button
            type="button"
            className="settings-button"
            onClick={() => setIsSettingsOpen((current) => !current)}
          >
            Settings
          </button>
        </div>
      </div>

      {isSettingsOpen && (
        <div className="settings-panel">
          <label className="settings-label" htmlFor="database-path">
            Database path
          </label>
          <input
            id="database-path"
            className="settings-input"
            value={dataPath}
            onChange={(event) => setDataPath(event.target.value)}
            placeholder="C:/path/to/spare-parts.csv"
          />
          <div className="settings-actions">
            <button type="button" className="primary-button small-button" onClick={handleSave}>
              Save
            </button>
            <button
              type="button"
              className="secondary-button small-button"
              onClick={() => setIsSettingsOpen(false)}
            >
              Close
            </button>
          </div>
          {status && <p className="settings-status">{status}</p>}
        </div>
      )}
    </nav>
  );
}
``