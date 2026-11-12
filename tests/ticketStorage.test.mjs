// Run with: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseTicket } from "../lib/ticketStorage.js";

const VALID_RAW = JSON.stringify({
  queueNumber: "A-001",
  createdAt: "2026-11-11T10:00:00.000Z",
  items: [{ id: 5, quantity: 1.5 }],
});

test("parseTicket accepts a valid ticket", () => {
  const ticket = parseTicket(VALID_RAW);
  assert.notEqual(ticket, null);
  assert.equal(ticket.queueNumber, "A-001");
  assert.equal(ticket.createdAt, "2026-11-11T10:00:00.000Z");
  assert.deepEqual(ticket.items, [{ id: 5, quantity: 1.5 }]);
});

test("parseTicket rejects empty string and missing data", () => {
  assert.equal(parseTicket(""), null);
  assert.equal(parseTicket("   "), null);
  assert.equal(parseTicket(null), null);
  assert.equal(parseTicket(undefined), null);
});

test("parseTicket rejects broken JSON", () => {
  assert.equal(parseTicket("{not json"), null);
  assert.equal(parseTicket('{"queueNumber": '), null);
});

test("parseTicket rejects tickets with missing fields", () => {
  assert.equal(
    parseTicket(JSON.stringify({ createdAt: "2026-11-11T10:00:00.000Z", items: [] })),
    null
  );
  assert.equal(parseTicket(JSON.stringify({ queueNumber: "A-001", items: [] })), null);
  assert.equal(parseTicket(JSON.stringify({ queueNumber: "A-001", createdAt: "2026-11-11T10:00:00.000Z" })), null);
  assert.equal(
    parseTicket(
      JSON.stringify({ queueNumber: "A-001", createdAt: "2026-11-11T10:00:00.000Z", items: [{ id: 5 }] })
    ),
    null
  );
});

test("parseTicket rejects JSON that is not an object", () => {
  assert.equal(parseTicket("42"), null);
  assert.equal(parseTicket('"a ticket"'), null);
  assert.equal(parseTicket("[]"), null);
  assert.equal(parseTicket("null"), null);
});

test("parseTicket rejects malformed item entries", () => {
  const base = { queueNumber: "A-001", createdAt: "2026-11-11T10:00:00.000Z" };
  assert.equal(
    parseTicket(JSON.stringify({ ...base, items: [{ id: "5", quantity: 1 }] })),
    null
  );
  assert.equal(
    parseTicket(JSON.stringify({ ...base, items: [{ id: 5, quantity: -2 }] })),
    null
  );
  assert.equal(
    parseTicket(JSON.stringify({ ...base, items: [{ id: 5, quantity: 0 }] })),
    null
  );
  assert.equal(
    parseTicket(JSON.stringify({ ...base, items: [{ id: 5, quantity: 1 }, "oops"] })),
    null
  );
});

test("parseTicket rejects an unparseable createdAt", () => {
  const bad = JSON.stringify({ queueNumber: "A-001", createdAt: "whenever", items: [] });
  assert.equal(parseTicket(bad), null);
});
