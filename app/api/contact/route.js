import { loadContacts, saveContact } from "@/server/contactStore";
import { validateContact } from "@/server/validateContact";
import { jsonWithLog } from "@/server/apiLog";

export async function GET(request) {
  try {
    const contacts = await loadContacts();
    const sorted = [...contacts].sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
    return jsonWithLog(request, 200, { contacts: sorted });
  } catch (error) {
    console.error("Failed to load contact submissions:", error);
    return jsonWithLog(request, 500, {
      status: "error",
      message: "Something went wrong while loading contact submissions.",
    });
  }
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonWithLog(request, 400, {
      status: "error",
      message: "Request body must be valid JSON.",
    });
  }

  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    return jsonWithLog(request, 400, {
      status: "error",
      message: "Request body must be a JSON object.",
    });
  }

  const { isValid, errors, data } = validateContact({
    name: body.name,
    email: body.email,
    message: body.message,
  });

  if (!isValid) {
    return jsonWithLog(request, 400, {
      status: "error",
      message: "Please fix the highlighted fields and try again.",
      errors,
    });
  }

  try {
    await saveContact(data);
    return jsonWithLog(request, 201, {
      status: "success",
      message: `Thanks, ${data.name}! Your message was sent and saved.`,
    });
  } catch (error) {
    console.error("Failed to save contact submission:", error);
    return jsonWithLog(request, 500, {
      status: "error",
      message: "Something went wrong while saving your message. Please try again.",
    });
  }
}
