// Loads and saves portfolio projects in data/projects.json.

import { promises as fs } from "node:fs";
import path from "node:path";

const DEFAULT_FILE = path.join(process.cwd(), "data", "projects.json");

async function readProjects(filePath) {
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

export async function loadProjects(filePath = DEFAULT_FILE) {
  return readProjects(filePath);
}

export async function saveProjects(projects, filePath = DEFAULT_FILE) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(projects, null, 2) + "\n", "utf8");
}
