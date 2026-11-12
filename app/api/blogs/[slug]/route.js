import { loadBlogs, saveBlogs } from "@/server/blogStore";
import { validateBlog } from "@/server/validateBlog";
import { jsonWithLog } from "@/server/apiLog";

function findBlog(blogs, slug) {
  return blogs.find((blog) => blog.slug === slug) ?? null;
}

export async function GET(request, { params }) {
  const { slug } = await params;
  try {
    const blogs = await loadBlogs();
    const blog = findBlog(blogs, slug);
    if (!blog) {
      return jsonWithLog(request, 404, {
        status: "error",
        message: "Blog post not found.",
      });
    }
    return jsonWithLog(request, 200, { blog });
  } catch (error) {
    console.error("Failed to load blog post:", error);
    return jsonWithLog(request, 500, {
      status: "error",
      message: "Something went wrong while loading the blog post.",
    });
  }
}

export async function PUT(request, { params }) {
  const { slug } = await params;

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
    const blogs = await loadBlogs();
    const blog = findBlog(blogs, slug);
    if (!blog) {
      return jsonWithLog(request, 404, {
        status: "error",
        message: "Blog post not found.",
      });
    }

    const merged = {
      title: body.title ?? blog.title,
      content: body.content ?? blog.content,
    };
    const { isValid, errors, data } = validateBlog(merged);
    if (!isValid) {
      return jsonWithLog(request, 400, {
        status: "error",
        message: "Please fix the highlighted fields and try again.",
        errors,
      });
    }

    // The slug is the post's identity (it is in the URL), so it stays fixed.
    blog.title = data.title;
    blog.content = data.content;

    await saveBlogs(blogs);
    return jsonWithLog(request, 200, { status: "success", blog });
  } catch (error) {
    console.error("Failed to update blog post:", error);
    return jsonWithLog(request, 500, {
      status: "error",
      message: "Something went wrong while updating the blog post.",
    });
  }
}

export async function DELETE(request, { params }) {
  const { slug } = await params;
  try {
    const blogs = await loadBlogs();
    const blog = findBlog(blogs, slug);
    if (!blog) {
      return jsonWithLog(request, 404, {
        status: "error",
        message: "Blog post not found.",
      });
    }

    const remaining = blogs.filter((existing) => existing.slug !== blog.slug);
    await saveBlogs(remaining);
    return jsonWithLog(request, 200, { status: "success", deleted: blog });
  } catch (error) {
    console.error("Failed to delete blog post:", error);
    return jsonWithLog(request, 500, {
      status: "error",
      message: "Something went wrong while deleting the blog post.",
    });
  }
}
