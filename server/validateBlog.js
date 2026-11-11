// Server-side validation for blog posts.
// Pure function (no file system access) so it is easy to test.

export function validateBlog({ title, content }) {
  const cleaned = {
    title: typeof title === "string" ? title.trim() : "",
    content: typeof content === "string" ? content.trim() : "",
  };

  const errors = {};
  if (!cleaned.title) {
    errors.title = "Please enter a title.";
  }
  if (!cleaned.content) {
    errors.content = "Please enter some content.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    data: cleaned,
  };
}
