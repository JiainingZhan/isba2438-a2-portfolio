// Server-side validation for portfolio projects.
// Pure function (no file system access) so it is easy to test.

function normalizeList(value) {
  if (!Array.isArray(value)) return [];
  return value.map((entry) => (typeof entry === "string" ? entry.trim() : "")).filter(Boolean);
}

export function validateProject({ title, summary, stack, details, repo, role }) {
  const cleaned = {
    title: typeof title === "string" ? title.trim() : "",
    summary: typeof summary === "string" ? summary.trim() : "",
    stack: normalizeList(stack),
    details: normalizeList(details),
    repo: typeof repo === "string" && repo.trim() !== "" ? repo.trim() : null,
    role: typeof role === "string" ? role.trim() : "",
  };

  const errors = {};
  if (!cleaned.title) {
    errors.title = "Please enter a title.";
  }
  if (!cleaned.summary) {
    errors.summary = "Please enter a summary.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    data: cleaned,
  };
}
