// Run with: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { validateProject } from "../server/validateProject.js";

const VALID_PROJECT = {
  title: "Test Project",
  summary: "A test project.",
  stack: ["Python", " JSON"],
  details: ["One", "Two"],
  repo: "https://github.com/example/test",
  role: "Solo.",
};

test("valid project passes", () => {
  const result = validateProject(VALID_PROJECT);
  assert.equal(result.isValid, true);
  assert.deepEqual(result.errors, {});
});

test("blank title or summary is rejected", () => {
  const result = validateProject({ ...VALID_PROJECT, title: "   " });
  assert.equal(result.isValid, false);
  assert.ok(result.errors.title);

  const result2 = validateProject({ ...VALID_PROJECT, summary: "" });
  assert.equal(result2.isValid, false);
  assert.ok(result2.errors.summary);
});

test("list fields are normalized and non-string entries dropped", () => {
  const result = validateProject({
    ...VALID_PROJECT,
    stack: ["  Python  ", "", 42],
    details: "not an array",
  });
  assert.equal(result.isValid, true);
  assert.deepEqual(result.data.stack, ["Python"]);
  assert.deepEqual(result.data.details, []);
});

test("empty repo becomes null", () => {
  const result = validateProject({ ...VALID_PROJECT, repo: "   " });
  assert.equal(result.isValid, true);
  assert.equal(result.data.repo, null);
});
