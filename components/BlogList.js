"use client";

import { useEffect, useState } from "react";
import BlogCard from "@/components/BlogCard";

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
        <BlogCard key={blog.slug} blog={blog} />
      ))}
    </div>
  );
}
