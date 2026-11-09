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

export async function saveContact({ name, email, message }, filePath = DEFAULT_FILE) {
  const contacts = await readContacts(filePath);
  const entry = {
    name,
    email,
    message,
    submittedAt: new Date().toISOString(),
  };
  contacts.push(entry);

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(contacts, null, 2) + "\n", "utf8");
  return entry;
}
