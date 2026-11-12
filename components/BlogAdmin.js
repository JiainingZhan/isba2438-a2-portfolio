"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import FieldError from "@/components/FieldError";

const EMPTY_FORM = { title: "", content: "" };

export default function BlogAdmin() {
  const [blogs, setBlogs] = useState(null);
  const [listFailed, setListFailed] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingSlug, setEditingSlug] = useState(null);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState(null);
  const [actionFailed, setActionFailed] = useState(false);
  const [pending, setPending] = useState(false);

  async function loadBlogs() {
    try {
      const response = await fetch("/api/blogs");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = await response.json();
      setBlogs(payload.blogs);
      setListFailed(false);
    } catch {
      setListFailed(true);
    }
  }

  useEffect(() => {
    loadBlogs();
  }, []);

  function updateField(field) {
    return (event) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };
  }

  function startEdit(blog) {
    setEditingSlug(blog.slug);
    setErrors({});
    setNotice(null);
    setActionFailed(false);
    setForm({ title: blog.title, content: blog.content });
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

    try {
      const response = await fetch(editingSlug ? `/api/blogs/${editingSlug}` : "/api/blogs", {
        method: editingSlug ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json().catch(() => null);

      if (response.ok && result?.blog) {
        setNotice(
          editingSlug
            ? `Updated "${result.blog.title}".`
            : `Added "${result.blog.title}" at /blogs/${result.blog.slug}.`
        );
        cancelEdit();
        await loadBlogs();
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

  async function deleteBlog(blog) {
    if (!window.confirm(`Delete "${blog.title}"? This cannot be undone.`)) return;
    setNotice(null);
    setActionFailed(false);
    try {
      const response = await fetch(`/api/blogs/${blog.slug}`, { method: "DELETE" });
      if (response.ok) {
        setNotice(`Deleted "${blog.title}".`);
        if (editingSlug === blog.slug) cancelEdit();
        await loadBlogs();
      } else {
        setActionFailed(true);
      }
    } catch {
      setActionFailed(true);
    }
  }

  if (listFailed) {
    return <p className="field-error">Could not load blog posts. Please try again later.</p>;
  }
  if (blogs === null) {
    return <p>Loading posts...</p>;
  }

  return (
    <div>
      {notice && (
        <div className="alert alert-success" role="status">
          {notice}
        </div>
      )}
      {actionFailed && (
        <div className="alert alert-error" role="alert">
          The last action failed. Please try again.
        </div>
      )}

      <div className="card-list">
        {blogs.map((blog) => (
          <article key={blog.slug} className="card">
            <h2>{blog.title}</h2>
            <p className="subheading">/blogs/{blog.slug}</p>
            <div className="button-row">
              <button type="button" className="button" onClick={() => startEdit(blog)}>
                Edit
              </button>
              <button
                type="button"
                className="button button-outline"
                onClick={() => deleteBlog(blog)}
              >
                Delete
              </button>
              <Link href={`/blogs/${blog.slug}`} className="button button-outline">
                View
              </Link>
            </div>
          </article>
        ))}
      </div>

      <h2>{editingSlug ? `Edit "${editingSlug}"` : "Add new post"}</h2>
      <form onSubmit={handleSubmit} className="contact-form" noValidate>
        <div className="field">
          <label htmlFor="blog-title">Title</label>
          <input
            id="blog-title"
            name="title"
            type="text"
            value={form.title}
            onChange={updateField("title")}
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? "blog-title-error" : undefined}
          />
          <FieldError id="blog-title-error" text={errors.title} />
        </div>

        <div className="field">
          <label htmlFor="blog-content">Content</label>
          <textarea
            id="blog-content"
            name="content"
            rows={8}
            value={form.content}
            onChange={updateField("content")}
            aria-invalid={Boolean(errors.content)}
            aria-describedby={errors.content ? "blog-content-error" : undefined}
          />
          <FieldError id="blog-content-error" text={errors.content} />
        </div>

        <div className="button-row">
          <button type="submit" className="button" disabled={pending}>
            {pending ? "Saving..." : editingSlug ? "Save changes" : "Publish post"}
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
