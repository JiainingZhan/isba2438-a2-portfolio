import { NextResponse } from "next/server";
import { validateContact } from "@/server/validateContact";
import { saveContact } from "@/server/contactStore";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { status: "error", message: "Request body must be valid JSON." },
      { status: 400 }
    );
  }

  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json(
      { status: "error", message: "Request body must be a JSON object." },
      { status: 400 }
    );
  }

  const { isValid, errors, data } = validateContact({
    name: body.name,
    email: body.email,
    message: body.message,
  });

  if (!isValid) {
    return NextResponse.json(
      {
        status: "error",
        message: "Please fix the highlighted fields and try again.",
        errors,
      },
      { status: 400 }
    );
  }

  try {
    await saveContact(data);
  } catch (error) {
    console.error("Failed to save contact submission:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Something went wrong while saving your message. Please try again.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { status: "success", message: `Thanks, ${data.name}! Your message was sent and saved.` },
    { status: 201 }
  );
}
