"use client";

import { useState } from "react";
import Link from "next/link";
import FieldError from "@/components/FieldError";

const EMPTY_FORM = { title: "", content: "" };

export default function BlogForm() {
  const [values, setValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [published, setPublished] = useState(null);
  const [topError, setTopError] = useState(null);
  const [failed, setFailed] = useState(false);
  const [pending, setPending] = useState(false);

  function handleChange(field) {
    return (event) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setPending(true);
    setErrors({});
    setPublished(null);
    setTopError(null);
    setFailed(false);

    let response;
    let payload;
    try {
      response = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      payload = await response.json();
    } catch {
      setPending(false);
      setFailed(true);
      return;
    }

    if (response.status === 201) {
      setValues(EMPTY_FORM);
      setPublished(payload.blog);
    } else if (response.status === 400) {
      setTopError(payload.message);
      setErrors(payload.errors ?? {});
    } else {
      setFailed(true);
    }

    setPending(false);
  }

  return (
    <div>
      {published && (
        <div className="alert alert-success" role="status">
          <strong>✓ Published.</strong> Your post is live at{" "}
          <Link href={`/blogs/${published.slug}`} className="text-link">
            /blogs/{published.slug}
          </Link>
          .
        </div>
      )}
      {topError && (
        <div className="alert alert-error" role="alert">
          <strong>✗ Not published.</strong> {topError}
        </div>
      )}
      {failed && (
        <div className="alert alert-error" role="alert">
          <strong>✗ Sending failed.</strong> Please try again. This is not a form problem — the
          server could not process your post.
        </div>
      )}

      <form onSubmit={handleSubmit} className="contact-form" noValidate>
        <div className="field">
          <label htmlFor="blog-title">Title</label>
          <input
            id="blog-title"
            name="title"
            type="text"
            value={values.title}
            onChange={handleChange("title")}
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
            value={values.content}
            onChange={handleChange("content")}
            aria-invalid={Boolean(errors.content)}
            aria-describedby={errors.content ? "blog-content-error" : undefined}
          />
          <FieldError id="blog-content-error" text={errors.content} />
        </div>

        <button type="submit" className="button" disabled={pending}>
          {pending ? "Publishing..." : "Publish post"}
        </button>
      </form>
    </div>
  );
}
