import { loadProjects, saveProjects } from "@/server/projectStore";
import { validateProject } from "@/server/validateProject";
import { generateSlug } from "@/server/slug";
import { jsonWithLog } from "@/server/apiLog";

export async function GET(request) {
  try {
    const projects = await loadProjects();
    return jsonWithLog(request, 200, { projects });
  } catch (error) {
    console.error("Failed to load projects:", error);
    return jsonWithLog(request, 500, {
      status: "error",
      message: "Something went wrong while loading projects.",
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

  const { isValid, errors, data } = validateProject({
    title: body.title,
    summary: body.summary,
    stack: body.stack,
    details: body.details,
    repo: body.repo,
    role: body.role,
  });

  if (!isValid) {
    return jsonWithLog(request, 400, {
      status: "error",
      message: "Please fix the highlighted fields and try again.",
      errors,
    });
  }

  try {
    const projects = await loadProjects();
    const entry = {
      slug: generateSlug(
        data.title,
        projects.map((project) => project.slug)
      ),
      ...data,
    };
    projects.push(entry);
    await saveProjects(projects);
    return jsonWithLog(request, 201, { status: "success", project: entry });
  } catch (error) {
    console.error("Failed to save project:", error);
    return jsonWithLog(request, 500, {
      status: "error",
      message: "Something went wrong while saving the project.",
    });
  }
}
