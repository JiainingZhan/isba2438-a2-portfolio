// Server-side validation for deli menu items.
// Pure function (no file system access) so it is easy to test.

const CATEGORIES = ["sausage", "smoked"];
const UNITS = ["lb", "ea"];

function isNonNegativeNumber(value) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

export function validateMenuItem({ name, category, unit, price, stock, availableToday }) {
  const cleaned = {
    name: typeof name === "string" ? name.trim() : "",
    category: typeof category === "string" ? category.trim().toLowerCase() : "",
    unit: typeof unit === "string" ? unit.trim().toLowerCase() : "",
    price,
    stock,
    availableToday,
  };

  const errors = {};
  if (!cleaned.name) {
    errors.name = "Please enter a name.";
  }
  if (!CATEGORIES.includes(cleaned.category)) {
    errors.category = "Category must be sausage or smoked.";
  }
  if (!UNITS.includes(cleaned.unit)) {
    errors.unit = "Unit must be lb or ea.";
  }
  if (!isNonNegativeNumber(cleaned.price)) {
    errors.price = "Price must be a number that is 0 or greater.";
  }
  if (!isNonNegativeNumber(cleaned.stock)) {
    errors.stock = "Stock must be a number that is 0 or greater.";
  }
  if (cleaned.availableToday !== undefined && typeof cleaned.availableToday !== "boolean") {
    errors.availableToday = "Available today must be true or false.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    data: cleaned,
  };
}
