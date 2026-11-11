// Slug generation for blog posts: pure functions so they are easy to test.

export function slugifyTitle(title) {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || "post";
}

export function generateSlug(title, existingSlugs) {
  const base = slugifyTitle(title);
  const taken = new Set(existingSlugs);
  if (!taken.has(base)) {
    return base;
  }
  let counter = 2;
  while (taken.has(`${base}-${counter}`)) {
    counter += 1;
  }
  return `${base}-${counter}`;
}
