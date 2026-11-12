import { loadContacts, saveContacts } from "@/server/contactStore";
import { validateContact } from "@/server/validateContact";
import { jsonWithLog } from "@/server/apiLog";

function findContact(contacts, rawId) {
  const id = Number(rawId);
  if (Number.isNaN(id)) return null;
  return contacts.find((contact) => contact.id === id) ?? null;
}

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    const contacts = await loadContacts();
    const contact = findContact(contacts, id);
    if (!contact) {
      return jsonWithLog(request, 404, {
        status: "error",
        message: "Contact submission not found.",
      });
    }
    return jsonWithLog(request, 200, { contact });
  } catch (error) {
    console.error("Failed to load contact submission:", error);
    return jsonWithLog(request, 500, {
      status: "error",
      message: "Something went wrong while loading the contact submission.",
    });
  }
}

export async function PUT(request, { params }) {
  const { id } = await params;

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

  try {
    const contacts = await loadContacts();
    const contact = findContact(contacts, id);
    if (!contact) {
      return jsonWithLog(request, 404, {
        status: "error",
        message: "Contact submission not found.",
      });
    }

    const merged = {
      name: body.name ?? contact.name,
      email: body.email ?? contact.email,
      message: body.message ?? contact.message,
    };
    const { isValid, errors, data } = validateContact(merged);
    if (!isValid) {
      return jsonWithLog(request, 400, {
        status: "error",
        message: "Please fix the highlighted fields and try again.",
        errors,
      });
    }

    contact.name = data.name;
    contact.email = data.email;
    contact.message = data.message;

    await saveContacts(contacts);
    return jsonWithLog(request, 200, { status: "success", contact });
  } catch (error) {
    console.error("Failed to update contact submission:", error);
    return jsonWithLog(request, 500, {
      status: "error",
      message: "Something went wrong while updating the contact submission.",
    });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    const contacts = await loadContacts();
    const contact = findContact(contacts, id);
    if (!contact) {
      return jsonWithLog(request, 404, {
        status: "error",
        message: "Contact submission not found.",
      });
    }

    const remaining = contacts.filter((existing) => existing.id !== contact.id);
    await saveContacts(remaining);
    return jsonWithLog(request, 200, { status: "success", deleted: contact });
  } catch (error) {
    console.error("Failed to delete contact submission:", error);
    return jsonWithLog(request, 500, {
      status: "error",
      message: "Something went wrong while deleting the contact submission.",
    });
  }
}
