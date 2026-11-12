// Run with: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { validateContact } from "../server/validateContact.js";
import { saveContact, loadContacts } from "../server/contactStore.js";

test("valid submission passes", () => {
  const result = validateContact({ name: "Joy", email: "joy@example.com", message: "Hello" });
  assert.equal(result.isValid, true);
  assert.deepEqual(result.errors, {});
});

test("empty name is rejected", () => {
  const result = validateContact({ name: "   ", email: "joy@example.com", message: "Hello" });
  assert.equal(result.isValid, false);
  assert.ok(result.errors.name);
});

test("empty message is rejected", () => {
  const result = validateContact({ name: "Joy", email: "joy@example.com", message: "" });
  assert.equal(result.isValid, false);
  assert.ok(result.errors.message);
});

test("invalid email format is rejected", () => {
  for (const email of ["joy", "joy@", "joy@example", "joy example@x.com"]) {
    const result = validateContact({ name: "Joy", email, message: "Hello" });
    assert.equal(result.isValid, false, `should reject ${email}`);
    assert.ok(result.errors.email);
  }
});

test("empty domain segment: joy@.example.com is rejected", () => {
  const result = validateContact({ name: "Joy", email: "joy@.example.com", message: "Hello" });
  assert.equal(result.isValid, false);
  assert.ok(result.errors.email);
});

test("empty domain segment: joy@example..com is rejected", () => {
  const result = validateContact({ name: "Joy", email: "joy@example..com", message: "Hello" });
  assert.equal(result.isValid, false);
  assert.ok(result.errors.email);
});

test("empty domain segment: joy@example.com. is rejected", () => {
  const result = validateContact({ name: "Joy", email: "joy@example.com.", message: "Hello" });
  assert.equal(result.isValid, false);
  assert.ok(result.errors.email);
});

test("saveContact appends entries with submittedAt", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "contacts-"));
  const file = path.join(dir, "contacts.json");
  await saveContact({ name: "A", email: "a@x.com", message: "one" }, file);
  await saveContact({ name: "B", email: "b@x.com", message: "two" }, file);
  const saved = JSON.parse(await readFile(file, "utf8"));
  assert.equal(saved.length, 2);
  assert.equal(saved[1].name, "B");
  assert.ok(!Number.isNaN(Date.parse(saved[0].submittedAt)));
});

test("saveContact assigns a unique id to each entry", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "contacts-"));
  const file = path.join(dir, "contacts.json");
  const one = await saveContact({ name: "A", email: "a@x.com", message: "one" }, file);
  const two = await saveContact({ name: "B", email: "b@x.com", message: "two" }, file);
  assert.equal(one.id, 1);
  assert.equal(two.id, 2);
});

test("loadContacts backfills missing ids and persists them", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "contacts-"));
  const file = path.join(dir, "contacts.json");
  await writeFile(
    file,
    JSON.stringify([
      { name: "Old One", email: "o1@x.com", message: "hi", submittedAt: "2026-01-01T00:00:00.000Z" },
      { name: "Old Two", email: "o2@x.com", message: "yo", submittedAt: "2026-01-02T00:00:00.000Z" },
    ])
  );

  const loaded = await loadContacts(file);
  assert.equal(loaded.length, 2);
  assert.equal(loaded[0].id, 1);
  assert.equal(loaded[1].id, 2);
  assert.equal(loaded[0].name, "Old One");

  const persisted = JSON.parse(await readFile(file, "utf8"));
  assert.equal(persisted[0].id, 1);
  assert.equal(persisted[1].id, 2);
});
