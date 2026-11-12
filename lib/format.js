// Shared display formatting helpers.

// Money: 15 -> "$15.00". Accepts numbers or numeric strings.
export function formatMoney(amount) {
  return `$${Number(amount).toFixed(2)}`;
}

// Date only: "November 1, 2026".
export function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Date and time: "November 1, 2026, 9:00 AM".
export function formatDateTime(isoDate) {
  return new Date(isoDate).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
