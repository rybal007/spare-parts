export const defaultActionPassword = "spareparts493";

export const getActionPassword = async () => {
  try {
    const response = await fetch("/api/config");

    if (!response.ok) {
      return defaultActionPassword;
    }

    const config = await response.json();
    const configuredPassword = typeof config?.password === "string" ? config.password : "";

    return configuredPassword.trim() || defaultActionPassword;
  } catch (error) {
    console.warn("Unable to load saved action password; using default.", error);
    return defaultActionPassword;
  }
};

export const authorizeProtectedAction = async (
  action: "edit" | "delete",
): Promise<boolean> => {
  const actionPassword = await getActionPassword();

  return new Promise((resolve) => {
    const dialog = document.createElement("dialog");
    dialog.style.width = "min(420px, calc(100vw - 2rem))";
    dialog.style.padding = "0";
    dialog.style.border = "none";
    dialog.style.borderRadius = "20px";
    dialog.style.background = "transparent";
    dialog.style.boxShadow = "none";
    dialog.innerHTML = `
      <form method="dialog" style="
        display: grid;
        gap: 1rem;
        width: 100%;
        padding: 1.5rem 1.5rem 1.25rem;
        background: rgba(30, 41, 59, 0.9);
        border: 1px solid rgba(148, 163, 184, 0.28);
        border-radius: 20px;
        box-shadow: 0 24px 60px rgba(15, 23, 42, 0.25);
        color: #e2e8f0;
        box-sizing: border-box;
      ">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem;">
          <h2 style="margin: 0; font-size: 1.15rem; font-weight: 700; color: #f8fafc;">Confirm password</h2>
          <div style="width: 2.5rem; height: 2.5rem; border-radius: 999px; display: grid; place-items: center; background: rgba(96, 165, 250, 0.12); color: #bfdbfe; font-weight: 700;">🔒</div>
        </div>
        <label style="display: grid; gap: 0.5rem; font-size: 0.82rem; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; color: #bfdbfe;">
          Password
          <input type="password" name="password" autocomplete="current-password" autofocus style="
            width: 100%;
            box-sizing: border-box;
            padding: 0.8rem 0.9rem;
            border-radius: 12px;
            border: 1px solid rgba(148, 163, 184, 0.35);
            background: rgba(15, 23, 42, 0.7);
            color: #f8fafc;
            font: inherit;
            outline: none;
          " />
        </label>
        <div style="display: flex; justify-content: flex-end; gap: 0.6rem; margin-top: 0.25rem;">
          <button type="button" data-cancel style="
            padding: 0.7rem 1rem;
            border-radius: 10px;
            border: 1px solid rgba(148, 163, 184, 0.25);
            background: rgba(148, 163, 184, 0.08);
            color: #e2e8f0;
            font: inherit;
            font-weight: 600;
            cursor: pointer;
          ">Cancel</button>
          <button type="submit" style="
            padding: 0.7rem 1rem;
            border: none;
            border-radius: 10px;
            background: linear-gradient(135deg, #60a5fa, #3b82f6);
            color: white;
            font: inherit;
            font-weight: 700;
            cursor: pointer;
            box-shadow: 0 10px 20px rgba(59, 130, 246, 0.28);
          ">Continue</button>
        </div>
      </form>
    `;

    let settled = false;
    const finish = (authorized: boolean) => {
      if (settled) return;
      settled = true;
      dialog.close();
      dialog.remove();
      resolve(authorized);
    };

    const form = dialog.querySelector("form");
    const passwordInput = dialog.querySelector<HTMLInputElement>(
      'input[name="password"]',
    );

    form?.addEventListener("submit", (event) => {
      event.preventDefault();

      if (passwordInput?.value === actionPassword) {
        const confirmed =
          action !== "delete" || window.confirm("Are you sure you want to delete?");
        finish(confirmed);
      } else {
        window.alert("Incorrect password.");
        passwordInput?.select();
      }
    });

    dialog.querySelector("[data-cancel]")?.addEventListener("click", () => {
      finish(false);
    });
    dialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      finish(false);
    });

    document.body.append(dialog);
    dialog.showModal();
    passwordInput?.focus();
  });
};