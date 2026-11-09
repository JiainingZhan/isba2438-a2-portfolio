// Server-side validation for the contact form.
// Pure function (no file system access) so it is easy to test.

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact({ name, email, message }) {
  const cleaned = {
    name: typeof name === "string" ? name.trim() : "",
    email: typeof email === "string" ? email.trim() : "",
    message: typeof message === "string" ? message.trim() : "",
  };

  const errors = {};
  if (!cleaned.name) {
    errors.name = "Please enter your name.";
  }
  if (!cleaned.email) {
    errors.email = "Please enter your email.";
  } else if (!EMAIL_PATTERN.test(cleaned.email)) {
    errors.email = "Please enter a valid email address, like name@example.com.";
  }
  if (!cleaned.message) {
    errors.message = "Please enter a message.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    data: cleaned,
  };
}
