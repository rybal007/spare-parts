import { useEffect, useState } from "react";
import { Cog, MoonStar, SunMedium, UserRound } from "lucide-react";
import { NavLink } from "react-router-dom";
import { getActionPassword } from "../services/actionAuthorization";
import {
  getActiveAccount,
  getRegisteredUsernames,
  loginAccount,
  logoutAccount,
  registerAccount,
} from "../services/accountService";

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/parts", label: "Spare Parts" },
  { to: "/add", label: "Add Part" },
  { to: "/inventory", label: "Inventory" },
  { to: "/reports", label: "Reports" },
];

type NavbarProps = {
  theme: "light" | "dark";
  onToggleTheme: () => void;
};

export default function Navbar({ theme, onToggleTheme }: NavbarProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [dataPath, setDataPath] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [registeredUsers, setRegisteredUsers] = useState<string[]>([]);
  const [activeUser, setActiveUser] = useState<string | null>(null);
  const [selectedLoginUser, setSelectedLoginUser] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [accountMessage, setAccountMessage] = useState("");

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

    const refreshAccounts = () => {
      const usernames = getRegisteredUsernames();
      setRegisteredUsers(usernames);
      setSelectedLoginUser((currentUser) => currentUser || usernames[0] || "");
      setActiveUser(getActiveAccount());
    };

    void loadSettings();
    refreshAccounts();
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
    if (dataPath && !dataPath.includes("spare-parts.csv") && !dataPath.includes("spare-parts.xlsx") && !dataPath.includes("spare-parts.xls")) {
      const allowLoad = window.confirm(
        `Allow the app to open and use the saved database at "${dataPath}"?`
      );

      if (!allowLoad) {
        setStatus("Database access denied.");
        return;
      }
    }

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

  const handleLogin = () => {
    const result = loginAccount(selectedLoginUser, loginPassword);
    setAccountMessage(result.message);
    if (result.ok) {
      setActiveUser(getActiveAccount());
      setLoginPassword("");
      setIsAccountOpen(true);
    }
  };

  const handleRegister = () => {
    if (registerPassword !== registerConfirmPassword) {
      setAccountMessage("Passwords do not match.");
      return;
    }

    const result = registerAccount(registerUsername, registerPassword);
    setAccountMessage(result.message);

    if (result.ok) {
      const usernames = getRegisteredUsernames();
      setRegisteredUsers(usernames);
      setSelectedLoginUser(usernames[usernames.length - 1] ?? "");
      setRegisterUsername("");
      setRegisterPassword("");
      setRegisterConfirmPassword("");
      setActiveUser(getActiveAccount());
      setLoginPassword("");
    }
  };

  const handleLogout = () => {
    logoutAccount();
    setActiveUser(null);
    setAccountMessage("Logged out.");
  };

  const isDarkMode = theme === "dark";

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

        <div className="nav-actions">
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

          <button
            type="button"
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <SunMedium size={18} /> : <MoonStar size={18} />}
            <span>{isDarkMode ? "Light" : "Dark"}</span>
          </button>

          <button
            type="button"
            className="account-button"
            onClick={() => setIsAccountOpen((current) => !current)}
            aria-label="Manage account"
            title="Account"
          >
            <UserRound size={18} className="settings-icon" />
            <span>{activeUser ? activeUser : "Login"}</span>
          </button>

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

      {isAccountOpen && (
        <div className="account-panel">
          <div className="account-header-row">
            <span className="settings-label">Account</span>
            {activeUser && (
              <button type="button" className="secondary-button small-button" onClick={handleLogout}>
                Logout
              </button>
            )}
          </div>

          {!activeUser ? (
            <>
              <div className="account-section">
                <label className="settings-label" htmlFor="login-user-select">
                  Username
                </label>
                <select
                  id="login-user-select"
                  className="settings-input"
                  value={selectedLoginUser}
                  onChange={(event) => setSelectedLoginUser(event.target.value)}
                >
                  {registeredUsers.length === 0 ? (
                    <option value="">No users registered</option>
                  ) : (
                    registeredUsers.map((user) => (
                      <option key={user} value={user}>
                        {user}
                      </option>
                    ))
                  )}
                </select>

                <label className="settings-label" htmlFor="login-password">
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  className="settings-input"
                  value={loginPassword}
                  onChange={(event) => setLoginPassword(event.target.value)}
                  placeholder="Enter password"
                />

                <div className="settings-actions">
                  <button type="button" className="primary-button small-button" onClick={handleLogin}>
                    Login
                  </button>
                </div>
              </div>

              <div className="account-divider" />

              <div className="account-section">
                <label className="settings-label" htmlFor="register-user-name">
                  Register account
                </label>
                <input
                  id="register-user-name"
                  className="settings-input"
                  value={registerUsername}
                  onChange={(event) => setRegisterUsername(event.target.value)}
                  placeholder="New username"
                />

                <label className="settings-label" htmlFor="register-password">
                  Password
                </label>
                <input
                  id="register-password"
                  type="password"
                  className="settings-input"
                  value={registerPassword}
                  onChange={(event) => setRegisterPassword(event.target.value)}
                  placeholder="Create password"
                />

                <label className="settings-label" htmlFor="register-confirm-password">
                  Confirm password
                </label>
                <input
                  id="register-confirm-password"
                  type="password"
                  className="settings-input"
                  value={registerConfirmPassword}
                  onChange={(event) => setRegisterConfirmPassword(event.target.value)}
                  placeholder="Confirm password"
                />

                <div className="settings-actions">
                  <button type="button" className="primary-button small-button" onClick={handleRegister}>
                    Register
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="account-section">
              <p className="account-user-box">Logged in as: {activeUser}</p>
            </div>
          )}

          {accountMessage && <p className="settings-status">{accountMessage}</p>}
        </div>
      )}

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