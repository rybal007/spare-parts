const actionPassword = import.meta.env.VITE_ACTION_PASSWORD || "spareparts493";

export const authorizeProtectedAction = (
  action: "edit" | "delete",
): Promise<boolean> =>
  new Promise((resolve) => {
    const dialog = document.createElement("dialog");
    dialog.style.padding = "1.5rem";
    dialog.style.border = "1px solid #d1d5db";
    dialog.style.borderRadius = "0.5rem";
    dialog.innerHTML = `
      <form method="dialog">
        <h2>Confirm ${action}</h2>
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