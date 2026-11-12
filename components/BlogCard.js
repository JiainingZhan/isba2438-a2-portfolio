import Link from "next/link";
import { formatDate } from "@/lib/format";

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
