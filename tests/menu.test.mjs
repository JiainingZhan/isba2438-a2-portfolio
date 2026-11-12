// Run with: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { validateMenuItem } from "../server/validateMenuItem.js";

const VALID_ITEM = {
  name: "Corn Sausage",
  category: "sausage",
  unit: "lb",
  price: 15,
  stock: 20,
};

test("valid menu item passes", () => {
  const result = validateMenuItem(VALID_ITEM);
  assert.equal(result.isValid, true);
  assert.deepEqual(result.errors, {});
});

test("item with blank name is rejected", () => {
  const result = validateMenuItem({ ...VALID_ITEM, name: "   " });
  assert.equal(result.isValid, false);
  assert.ok(result.errors.name);
});

test("unit other than lb or ea is rejected", () => {
  const result = validateMenuItem({ ...VALID_ITEM, unit: "kg" });
  assert.equal(result.isValid, false);
  assert.ok(result.errors.unit);
  assert.equal(validateMenuItem({ ...VALID_ITEM, unit: "EA" }).isValid, true);
});

test("category other than sausage or smoked is rejected", () => {
  const result = validateMenuItem({ ...VALID_ITEM, category: "deli" });
  assert.equal(result.isValid, false);
  assert.ok(result.errors.category);
  assert.equal(validateMenuItem({ ...VALID_ITEM, category: "Smoked" }).isValid, true);
});

test("negative price or stock is rejected", () => {
  const result = validateMenuItem({ ...VALID_ITEM, price: -1 });
  assert.equal(result.isValid, false);
  assert.ok(result.errors.price);

  const result2 = validateMenuItem({ ...VALID_ITEM, stock: -5 });
  assert.equal(result2.isValid, false);
  assert.ok(result2.errors.stock);
});

test("non-numeric price or stock is rejected", () => {
  const result = validateMenuItem({ ...VALID_ITEM, price: "15" });
  assert.equal(result.isValid, false);
  assert.ok(result.errors.price);

  const result2 = validateMenuItem({ ...VALID_ITEM, stock: Number.NaN });
  assert.equal(result2.isValid, false);
  assert.ok(result2.errors.stock);
});

test("availableToday must be a boolean when provided", () => {
  const result = validateMenuItem({ ...VALID_ITEM, availableToday: "yes" });
  assert.equal(result.isValid, false);
  assert.ok(result.errors.availableToday);

  const result2 = validateMenuItem({ ...VALID_ITEM, availableToday: false });
  assert.equal(result2.isValid, true);
});

test("availableToday may be omitted", () => {
  const result = validateMenuItem(VALID_ITEM);
  assert.equal(result.isValid, true);
  assert.equal(result.data.availableToday, undefined);
});
