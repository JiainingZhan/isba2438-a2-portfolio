// Saves contact form submissions to data/contacts.json.

import { promises as fs } from "node:fs";
import path from "node:path";

const DEFAULT_FILE = path.join(process.cwd(), "data", "contacts.json");

async function readContacts(filePath) {
  try {
    const text = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    // Missing or empty file: start with an empty list.
    if (error.code === "ENOENT" || error instanceof SyntaxError) {
      return [];
    }
    throw error;
  }
}

async function writeContacts(contacts, filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(contacts, null, 2) + "\n", "utf8");
}

function nextIdFor(contacts) {
  return contacts.reduce((max, contact) => Math.max(max, Number(contact.id) || 0), 0) + 1;
}

// Reads all submissions. Older records saved before ids existed get a unique
// id here, and the file is written back so no data is lost.
export async function loadContacts(filePath = DEFAULT_FILE) {
  const contacts = await readContacts(filePath);
  let nextId = nextIdFor(contacts);
  let changed = false;
  for (const contact of contacts) {
    if (!Number.isInteger(contact.id)) {
      contact.id = nextId;
      nextId += 1;
      changed = true;
    }
  }
  if (changed) {
    await writeContacts(contacts, filePath);
  }
  return contacts;
}

// Writes the whole list (used by the admin API to update and delete).
export async function saveContacts(contacts, filePath = DEFAULT_FILE) {
  await writeContacts(contacts, filePath);
}

// Appends one submission with a unique id. Used by both contact forms.
export async function saveContact({ name, email, message }, filePath = DEFAULT_FILE) {
  const contacts = await loadContacts(filePath);
  const entry = {
    id: nextIdFor(contacts),
    name,
    email,
    message,
    submittedAt: new Date().toISOString(),
  };
  contacts.push(entry);
  await writeContacts(contacts, filePath);
  return entry;
}
