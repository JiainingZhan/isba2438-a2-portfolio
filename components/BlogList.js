"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogList() {
  const [blogs, setBlogs] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/blogs")
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((payload) => {
        if (!cancelled) setBlogs(payload.blogs);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (failed) {
    return <p className="field-error">Could not load blog posts. Please try again later.</p>;
  }
  if (blogs === null) {
    return <p>Loading posts...</p>;
  }
  if (blogs.length === 0) {
    return <p>No posts yet.</p>;
  }

  return (
    <div className="card-list">
      {blogs.map((blog) => (
        <article key={blog.slug} className="card">
          <h2>
            <Link href={`/blogs/${blog.slug}`}>{blog.title}</Link>
          </h2>
          <p className="subheading">{formatDate(blog.createdAt)}</p>
          <Link href={`/blogs/${blog.slug}`} className="text-link">
            Read post →
          </Link>
        </article>
      ))}
    </div>
  );
}
