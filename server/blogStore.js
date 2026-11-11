// Loads and saves blog posts in data/blogs.json.

import { promises as fs } from "node:fs";
import path from "node:path";

const DEFAULT_FILE = path.join(process.cwd(), "data", "blogs.json");

async function readBlogs(filePath) {
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

export async function loadBlogs(filePath = DEFAULT_FILE) {
  return readBlogs(filePath);
}

export async function saveBlog(entry, filePath = DEFAULT_FILE) {
  const blogs = await readBlogs(filePath);
  blogs.push(entry);

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(blogs, null, 2) + "\n", "utf8");
  return entry;
}
