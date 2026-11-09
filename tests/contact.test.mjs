// Run with: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { validateContact } from "../server/validateContact.js";
import { saveContact } from "../server/contactStore.js";

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
