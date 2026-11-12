import { loadProjects, saveProjects } from "@/server/projectStore";
import { validateProject } from "@/server/validateProject";
import { jsonWithLog } from "@/server/apiLog";

function findProject(projects, slug) {
  return projects.find((project) => project.slug === slug) ?? null;
}

export async function GET(request, { params }) {
  const { slug } = await params;
  try {
    const projects = await loadProjects();
    const project = findProject(projects, slug);
    if (!project) {
      return jsonWithLog(request, 404, {
        status: "error",
        message: "Project not found.",
      });
    }
    return jsonWithLog(request, 200, { project });
  } catch (error) {
    console.error("Failed to load project:", error);
    return jsonWithLog(request, 500, {
      status: "error",
      message: "Something went wrong while loading the project.",
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
    const projects = await loadProjects();
    const project = findProject(projects, slug);
    if (!project) {
      return jsonWithLog(request, 404, {
        status: "error",
        message: "Project not found.",
      });
    }

    const merged = {
      title: body.title ?? project.title,
      summary: body.summary ?? project.summary,
      stack: body.stack ?? project.stack,
      details: body.details ?? project.details,
      repo: body.repo === undefined ? project.repo : body.repo,
      role: body.role ?? project.role,
    };
    const { isValid, errors, data } = validateProject(merged);
    if (!isValid) {
      return jsonWithLog(request, 400, {
        status: "error",
        message: "Please fix the highlighted fields and try again.",
        errors,
      });
    }

    // The slug is the item's identity (it is in the URL), so it stays fixed.
    project.title = data.title;
    project.summary = data.summary;
    project.stack = data.stack;
    project.details = data.details;
    project.repo = data.repo;
    project.role = data.role;

    await saveProjects(projects);
    return jsonWithLog(request, 200, { status: "success", project });
  } catch (error) {
    console.error("Failed to update project:", error);
    return jsonWithLog(request, 500, {
      status: "error",
      message: "Something went wrong while updating the project.",
    });
  }
}

export async function DELETE(request, { params }) {
  const { slug } = await params;
  try {
    const projects = await loadProjects();
    const project = findProject(projects, slug);
    if (!project) {
      return jsonWithLog(request, 404, {
        status: "error",
        message: "Project not found.",
      });
    }

    const remaining = projects.filter((existing) => existing.slug !== project.slug);
    await saveProjects(remaining);
    return jsonWithLog(request, 200, { status: "success", deleted: project });
  } catch (error) {
    console.error("Failed to delete project:", error);
    return jsonWithLog(request, 500, {
      status: "error",
      message: "Something went wrong while deleting the project.",
    });
  }
}
