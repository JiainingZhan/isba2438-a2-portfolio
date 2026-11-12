import Link from "next/link";

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogCard({ blog }) {
  return (
    <article className="card">
      <h2>
        <Link href={`/blogs/${blog.slug}`}>{blog.title}</Link>
      </h2>
      <p className="subheading">{formatDate(blog.createdAt)}</p>
      <Link href={`/blogs/${blog.slug}`} className="text-link">
        Read post →
      </Link>
    </article>
  );
}
