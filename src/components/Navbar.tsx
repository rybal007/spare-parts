import { useEffect, useState } from "react";
import { Cog } from "lucide-react";
import { NavLink } from "react-router-dom";
import { getActionPassword } from "../services/actionAuthorization";

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
  const [password, setPassword] = useState("");
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
        setPassword(config.password || "");
      } catch (error) {
        console.warn("Unable to load database settings:", error);
      }
    };

    void loadSettings();
  }, []);

  const handleOpenSettings = async () => {
    const actionPassword = await getActionPassword();

    const enteredPassword = await new Promise<string | null>((resolve) => {
      const dialog = document.createElement("dialog");
      dialog.style.padding = "1.5rem";
      dialog.style.border = "1px solid #d1d5db";
      dialog.style.borderRadius = "0.5rem";
      dialog.innerHTML = `
        <form method="dialog">
          <h2>Open settings</h2>
          <label>
            Password
            <input type="password" name="password" autocomplete="current-password" autofocus />
          </label>
          <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
            <button type="button" data-cancel>Cancel</button>
            <button type="submit">Continue</button>
          </div>
        </form>
      `;

      const form = dialog.querySelector("form");
      const passwordInput = dialog.querySelector<HTMLInputElement>('input[name="password"]');

      const finish = (value: string | null) => {
        dialog.close();
        dialog.remove();
        resolve(value);
      };

      form?.addEventListener("submit", (event) => {
        event.preventDefault();
        finish(passwordInput?.value ?? "");
      });

      dialog.querySelector("[data-cancel]")?.addEventListener("click", () => {
        finish(null);
      });

      dialog.addEventListener("cancel", (event) => {
        event.preventDefault();
        finish(null);
      });

      document.body.append(dialog);
      dialog.showModal();
      passwordInput?.focus();
    });

    if (enteredPassword === null) {
      return;
    }

    if (enteredPassword !== actionPassword) {
      window.alert("Incorrect password.");
      return;
    }

    setIsSettingsOpen(true);
  };

  const handleSave = async () => {
    try {
      const response = await fetch("/api/config", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dataPath, password }),
      });

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      const config = await response.json();
      setStatus("Settings saved successfully.");
      setDataPath(config.dataPath || dataPath);
      setPassword(config.password || password);
    } catch (error) {
      console.error(error);
      setStatus("Unable to save settings.");
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
            onClick={handleOpenSettings}
            aria-label="Open settings"
            title="Settings"
          >
            <Cog size={18} className="settings-icon" />
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

          <label className="settings-label" htmlFor="settings-password">
            Password
          </label>
          <input
            id="settings-password"
            type="password"
            className="settings-input"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter password"
            autoComplete="current-password"
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