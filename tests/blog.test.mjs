// Run with: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { validateBlog } from "../server/validateBlog.js";
import { generateSlug, slugifyTitle } from "../server/slug.js";

test("valid blog passes", () => {
  const result = validateBlog({ title: "Hello", content: "World" });
  assert.equal(result.isValid, true);
  assert.deepEqual(result.errors, {});
});

test("blog title and content are trimmed", () => {
  const result = validateBlog({ title: "  Hello  ", content: " World \n" });
  assert.equal(result.isValid, true);
  assert.equal(result.data.title, "Hello");
  assert.equal(result.data.content, "World");
});

test("empty blog title is rejected", () => {
  const result = validateBlog({ title: "   ", content: "World" });
  assert.equal(result.isValid, false);
  assert.ok(result.errors.title);
});

test("empty blog content is rejected", () => {
  const result = validateBlog({ title: "Hello", content: "" });
  assert.equal(result.isValid, false);
  assert.ok(result.errors.content);
});

test("non-string blog fields are rejected", () => {
  const result = validateBlog({ title: 42, content: null });
  assert.equal(result.isValid, false);
  assert.ok(result.errors.title);
  assert.ok(result.errors.content);
});

test("slugifyTitle keeps letters, digits and dashes", () => {
  assert.equal(slugifyTitle("Hello, World!"), "hello-world");
  assert.equal(slugifyTitle("  My  Second Post  "), "my-second-post");
  assert.equal(slugifyTitle("!!!"), "post");
});

test("generateSlug returns base slug when free", () => {
  assert.equal(generateSlug("My Post", []), "my-post");
});

test("generateSlug adds numeric suffix on duplicates", () => {
  assert.equal(generateSlug("My Post", ["my-post"]), "my-post-2");
  assert.equal(generateSlug("My Post", ["my-post", "my-post-2"]), "my-post-3");
  assert.equal(generateSlug("My Post", ["my-post-2"]), "my-post");
});
