import { NextResponse } from "next/server";
import { loadBlogs, saveBlog } from "@/server/blogStore";
import { validateBlog } from "@/server/validateBlog";
import { generateSlug } from "@/server/slug";

export async function GET() {
  try {
    const blogs = await loadBlogs();
    const sorted = [...blogs].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return NextResponse.json({ blogs: sorted });
  } catch (error) {
    console.error("Failed to load blogs:", error);
    return NextResponse.json(
      { status: "error", message: "Something went wrong while loading blogs." },
      { status: 500 }
    );
  }
}

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

  const { isValid, errors, data } = validateBlog({
    title: body.title,
    content: body.content,
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
    const existing = await loadBlogs();
    const entry = {
      slug: generateSlug(
        data.title,
        existing.map((blog) => blog.slug)
      ),
      title: data.title,
      content: data.content,
      createdAt: new Date().toISOString(),
    };
    await saveBlog(entry);
    return NextResponse.json({ status: "success", blog: entry }, { status: 201 });
  } catch (error) {
    console.error("Failed to save blog post:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Something went wrong while saving your post. Please try again.",
      },
      { status: 500 }
    );
  }
}
