import { loadBlogs, saveBlogs } from "@/server/blogStore";
import { validateBlog } from "@/server/validateBlog";
import { generateSlug } from "@/server/slug";
import { jsonWithLog } from "@/server/apiLog";

export async function GET(request) {
  try {
    const blogs = await loadBlogs();
    const sorted = [...blogs].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return jsonWithLog(request, 200, { blogs: sorted });
  } catch (error) {
    console.error("Failed to load blogs:", error);
    return jsonWithLog(request, 500, {
      status: "error",
      message: "Something went wrong while loading blogs.",
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

  const { isValid, errors, data } = validateBlog({
    title: body.title,
    content: body.content,
  });

  if (!isValid) {
    return jsonWithLog(request, 400, {
      status: "error",
      message: "Please fix the highlighted fields and try again.",
      errors,
    });
  }

  try {
    const blogs = await loadBlogs();
    const entry = {
      slug: generateSlug(
        data.title,
        blogs.map((blog) => blog.slug)
      ),
      title: data.title,
      content: data.content,
      createdAt: new Date().toISOString(),
    };
    blogs.push(entry);
    await saveBlogs(blogs);
    return jsonWithLog(request, 201, { status: "success", blog: entry });
  } catch (error) {
    console.error("Failed to save blog post:", error);
    return jsonWithLog(request, 500, {
      status: "error",
      message: "Something went wrong while saving your post. Please try again.",
    });
  }
}
