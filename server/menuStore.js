// Loads and saves deli menu items in data/menu.json.

import { promises as fs } from "node:fs";
import path from "node:path";

const DEFAULT_FILE = path.join(process.cwd(), "data", "menu.json");

async function readItems(filePath) {
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

export async function loadMenu(filePath = DEFAULT_FILE) {
  return readItems(filePath);
}

export async function saveMenu(items, filePath = DEFAULT_FILE) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(items, null, 2) + "\n", "utf8");
}
