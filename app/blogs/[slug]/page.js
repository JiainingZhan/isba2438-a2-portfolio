import Link from "next/link";
import { notFound } from "next/navigation";
import { loadBlogs } from "@/server/blogStore";

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

async function getBlogBySlug(slug) {
  const blogs = await loadBlogs();
  return blogs.find((blog) => blog.slug === slug) ?? null;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  return { title: blog ? `${blog.title} — Joy (Jianing Zhan)` : "Blog post not found" };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  // Unknown slug → show app/blogs/[slug]/not-found.js instead of crashing.
  if (!blog) {
    notFound();
  }

  return (
    <article>
      <Link href="/blogs" className="text-link">
        ← Back to Blog
      </Link>
      <h1>{blog.title}</h1>
      <p className="subheading">{formatDate(blog.createdAt)}</p>

      <div className="blog-content">
        {blog.content.split(/\n{2,}/).map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
