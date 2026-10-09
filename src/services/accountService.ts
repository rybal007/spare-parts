export type AccountRecord = {
  username: string;
  password: string;
  createdAt: string;
};

const ACCOUNTS_KEY = "sparePartsAccounts";
const ACTIVE_ACCOUNT_KEY = "sparePartsActiveAccount";

const readAccounts = (): AccountRecord[] => {
  if (typeof window === "undefined") {
    return [];
  }

  const rawAccounts = window.localStorage.getItem(ACCOUNTS_KEY);

  if (!rawAccounts) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawAccounts) as AccountRecord[];
    return Array.isArray(parsed) ? parsed.filter((account) => account && typeof account.username === "string") : [];
  } catch (error) {
    console.warn("Unable to read registered accounts:", error);
    return [];
  }
};

const writeAccounts = (accounts: AccountRecord[]): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
};

export const getRegisteredUsernames = (): string[] =>
  readAccounts().map((account) => account.username);

export const getActiveAccount = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const activeUser = window.localStorage.getItem(ACTIVE_ACCOUNT_KEY);
  return activeUser && activeUser.trim() ? activeUser : null;
};

export const setActiveAccount = (username: string | null): void => {
  if (typeof window === "undefined") {
    return;
  }

  if (!username) {
    window.localStorage.removeItem(ACTIVE_ACCOUNT_KEY);
    return;
  }

  window.localStorage.setItem(ACTIVE_ACCOUNT_KEY, username);
};

export const registerAccount = (username: string, password: string): { ok: boolean; message: string } => {
  const trimmedUsername = username.trim();

  if (!trimmedUsername) {
    return { ok: false, message: "Username is required." };
  }

  if (trimmedUsername.length < 3) {
    return { ok: false, message: "Username must be at least 3 characters." };
  }

  if (password.trim().length < 4) {
    return { ok: false, message: "Password must be at least 4 characters." };
  }

  const accounts = readAccounts();
  const alreadyExists = accounts.some(
    (account) => account.username.toLowerCase() === trimmedUsername.toLowerCase(),
  );

  if (alreadyExists) {
    return { ok: false, message: "That username is already registered." };
  }

  const nextAccounts = [
    ...accounts,
    {
      username: trimmedUsername,
      password: password.trim(),
      createdAt: new Date().toISOString(),
    },
  ];

  writeAccounts(nextAccounts);
  setActiveAccount(trimmedUsername);

  return { ok: true, message: `Account created for ${trimmedUsername}.` };
};

export const loginAccount = (username: string, password: string): { ok: boolean; message: string } => {
  const trimmedUsername = username.trim();

  if (!trimmedUsername) {
    return { ok: false, message: "Select a username to log in." };
  }

  const accounts = readAccounts();
  const matchingAccount = accounts.find(
    (account) => account.username.toLowerCase() === trimmedUsername.toLowerCase(),
  );

  if (!matchingAccount) {
    return { ok: false, message: "Username not found." };
  }

  if (matchingAccount.password !== password) {
    return { ok: false, message: "Incorrect password." };
  }

  setActiveAccount(trimmedUsername);

  return { ok: true, message: `Welcome back, ${trimmedUsername}.` };
};

export const logoutAccount = (): void => {
  setActiveAccount(null);
};
