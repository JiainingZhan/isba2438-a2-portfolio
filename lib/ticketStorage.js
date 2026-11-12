// Queue-ticket storage for /deli, kept in the browser's LocalStorage.
// All LocalStorage access lives here so the components never touch it directly.

const TICKET_KEY = "deli_queue_ticket";
const COUNTER_KEY = "deli_queue_counter";

// Pure format checker: takes the raw string and returns a clean ticket or null.
// Kept free of LocalStorage/window so it is easy to unit test.
export function parseTicket(raw) {
  // Empty or missing data means "no saved ticket".
  if (typeof raw !== "string" || raw.trim() === "") {
    return null;
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    // Broken JSON is treated as no ticket.
    return null;
  }

  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    return null;
  }

  const { queueNumber, createdAt, items } = parsed;

  if (typeof queueNumber !== "string" || queueNumber.trim() === "") {
    return null;
  }
  if (typeof createdAt !== "string" || Number.isNaN(Date.parse(createdAt))) {
    return null;
  }
  if (!Array.isArray(items)) {
    return null;
  }

  const cleanItems = [];
  for (const entry of items) {
    if (entry === null || typeof entry !== "object" || Array.isArray(entry)) {
      return null;
    }
    if (!Number.isInteger(entry.id)) {
      return null;
    }
    if (typeof entry.quantity !== "number" || !Number.isFinite(entry.quantity) || entry.quantity <= 0) {
      return null;
    }
    cleanItems.push({ id: entry.id, quantity: entry.quantity });
  }

  return { queueNumber, createdAt, items: cleanItems };
}

// Reads the saved ticket. Returns the ticket or null ("No saved ticket").
export function loadTicket() {
  // LocalStorage is unavailable during SSR or if the browser blocks it.
  if (typeof window === "undefined" || !window.localStorage) {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(TICKET_KEY);
    const ticket = parseTicket(raw);
    if (!ticket) {
      // Bad data: remove it so the next read is clean, then report no ticket.
      if (raw !== null) {
        window.localStorage.removeItem(TICKET_KEY);
      }
      return null;
    }
    return ticket;
  } catch {
    return null;
  }
}

// Writes the ticket. Returns true on success so the UI can warn if it failed.
export function saveTicket(ticket) {
  if (typeof window === "undefined" || !window.localStorage) {
    return false;
  }
  try {
    window.localStorage.setItem(TICKET_KEY, JSON.stringify(ticket));
    return true;
  } catch {
    return false;
  }
}

// Removes the saved ticket ("Cancel ticket").
export function clearTicket() {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }
  try {
    window.localStorage.removeItem(TICKET_KEY);
  } catch {
    // Nothing to clean up if storage is unavailable.
  }
}

// Hands out the next queue number (A-001, A-002, ...). The counter lives in
// its own key so numbers keep rising even after a ticket is cancelled.
export function nextQueueNumber() {
  if (typeof window === "undefined" || !window.localStorage) {
    return "A-001";
  }
  try {
    const current = Number(window.localStorage.getItem(COUNTER_KEY)) || 0;
    const next = current + 1;
    window.localStorage.setItem(COUNTER_KEY, String(next));
    return `A-${String(next).padStart(3, "0")}`;
  } catch {
    return "A-001";
  }
}
