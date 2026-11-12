"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import FieldError from "@/components/FieldError";
import StatusAlert from "@/components/StatusAlert";

const EMPTY_FORM = {
  title: "",
  summary: "",
  stack: "",
  details: "",
  repo: "",
  role: "",
};

function splitList(value) {
  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export default function ProjectAdmin() {
  const [projects, setProjects] = useState(null);
  const [listFailed, setListFailed] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingSlug, setEditingSlug] = useState(null);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState(null);
  const [actionFailed, setActionFailed] = useState(false);
  const [pending, setPending] = useState(false);

  async function loadProjects() {
    try {
      const response = await fetch("/api/projects");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = await response.json();
      setProjects(payload.projects);
      setListFailed(false);
    } catch {
      setListFailed(true);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  function updateField(field) {
    return (event) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };
  }

  function startEdit(project) {
    setEditingSlug(project.slug);
    setErrors({});
    setNotice(null);
    setActionFailed(false);
    setForm({
      title: project.title,
      summary: project.summary,
      stack: project.stack.join(", "),
      details: project.details.join("\n"),
      repo: project.repo ?? "",
      role: project.role,
    });
  }

  function cancelEdit() {
    setEditingSlug(null);
    setErrors({});
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setPending(true);
    setErrors({});
    setNotice(null);
    setActionFailed(false);

    const payload = {
      title: form.title,
      summary: form.summary,
      stack: splitList(form.stack),
      details: form.details
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      repo: form.repo,
      role: form.role,
    };

    try {
      const response = await fetch(
        editingSlug ? `/api/projects/${editingSlug}` : "/api/projects",
        {
          method: editingSlug ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const result = await response.json().catch(() => null);

      if (response.ok && result?.project) {
        setNotice(
          editingSlug
            ? `Updated "${result.project.title}".`
            : `Added "${result.project.title}" at /projects/${result.project.slug}.`
        );
        cancelEdit();
        await loadProjects();
      } else if (response.status === 400) {
        setErrors(result?.errors ?? {});
      } else {
        setActionFailed(true);
      }
    } catch {
      setActionFailed(true);
    }

    setPending(false);
  }

  async function deleteProject(project) {
    if (!window.confirm(`Delete "${project.title}"? This cannot be undone.`)) return;
    setNotice(null);
    setActionFailed(false);
    try {
      const response = await fetch(`/api/projects/${project.slug}`, { method: "DELETE" });
      if (response.ok) {
        setNotice(`Deleted "${project.title}".`);
        if (editingSlug === project.slug) cancelEdit();
        await loadProjects();
      } else {
        setActionFailed(true);
      }
    } catch {
      setActionFailed(true);
    }
  }

  if (listFailed) {
    return <p className="field-error">Could not load projects. Please try again later.</p>;
  }
  if (projects === null) {
    return <p>Loading projects...</p>;
  }

  return (
    <div>
      <StatusAlert type="success" text={notice} />
      <StatusAlert
        type="error"
        text={actionFailed ? "The last action failed. Please try again." : null}
      />

      <div className="card-list">
        {projects.map((project) => (
          <article key={project.slug} className="card">
            <h2>{project.title}</h2>
            <p>{project.summary}</p>
            <p className="subheading">/projects/{project.slug}</p>
            <div className="button-row">
              <button type="button" className="button" onClick={() => startEdit(project)}>
                Edit
              </button>
              <button
                type="button"
                className="button button-outline"
                onClick={() => deleteProject(project)}
              >
                Delete
              </button>
              <Link href={`/projects/${project.slug}`} className="button button-outline">
                View
              </Link>
            </div>
          </article>
        ))}
      </div>

      <h2>{editingSlug ? `Edit "${editingSlug}"` : "Add new project"}</h2>
      <form onSubmit={handleSubmit} className="contact-form" noValidate>
        <div className="field">
          <label htmlFor="project-title">Title</label>
          <input
            id="project-title"
            name="title"
            type="text"
            value={form.title}
            onChange={updateField("title")}
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? "project-title-error" : undefined}
          />
          <FieldError id="project-title-error" text={errors.title} />
        </div>

        <div className="field">
          <label htmlFor="project-summary">Summary</label>
          <textarea
            id="project-summary"
            name="summary"
            rows={2}
            value={form.summary}
            onChange={updateField("summary")}
            aria-invalid={Boolean(errors.summary)}
            aria-describedby={errors.summary ? "project-summary-error" : undefined}
          />
          <FieldError id="project-summary-error" text={errors.summary} />
        </div>

        <div className="field">
          <label htmlFor="project-stack">Stack (comma separated)</label>
          <input
            id="project-stack"
            name="stack"
            type="text"
            value={form.stack}
            onChange={updateField("stack")}
            placeholder="Python, Tableau"
          />
        </div>

        <div className="field">
          <label htmlFor="project-details">Details (one per line)</label>
          <textarea
            id="project-details"
            name="details"
            rows={4}
            value={form.details}
            onChange={updateField("details")}
          />
        </div>

        <div className="field">
          <label htmlFor="project-repo">Repository URL (optional)</label>
          <input
            id="project-repo"
            name="repo"
            type="url"
            value={form.repo}
            onChange={updateField("repo")}
            placeholder="https://github.com/..."
          />
        </div>

        <div className="field">
          <label htmlFor="project-role">Role (optional)</label>
          <input
            id="project-role"
            name="role"
            type="text"
            value={form.role}
            onChange={updateField("role")}
          />
        </div>

        <div className="button-row">
          <button type="submit" className="button" disabled={pending}>
            {pending ? "Saving..." : editingSlug ? "Save changes" : "Add project"}
          </button>
          {editingSlug && (
            <button type="button" className="button button-outline" onClick={cancelEdit}>
              Cancel edit
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
