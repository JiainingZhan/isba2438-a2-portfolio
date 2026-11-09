"use server";

// Server action: the contact form posts here. Runs only on the server.

import { validateContact } from "@/server/validateContact";
import { saveContact } from "@/server/contactStore";

export async function submitContact(previousState, formData) {
  const submitted = {
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  };

  const { isValid, errors, data } = validateContact(submitted);

  if (!isValid) {
    return {
      id: Date.now(),
      status: "error",
      message: "Please fix the highlighted fields and try again.",
      errors,
      values: data,
    };
  }

  try {
    await saveContact(data);
  } catch (error) {
    console.error("Failed to save contact submission:", error);
    return {
      id: Date.now(),
      status: "error",
      message: "Something went wrong while saving your message. Please try again.",
      errors: {},
      values: data,
    };
  }

  return {
    id: Date.now(),
    status: "success",
    message: `Thanks, ${data.name}! Your message was sent and saved.`,
    errors: {},
    values: { name: "", email: "", message: "" },
  };
}
