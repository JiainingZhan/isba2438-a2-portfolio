import Link from "next/link";

export default function BlogNotFound() {
  return (
    <section className="not-found">
      <h1>Blog post not found</h1>
      <p>Sorry, there is no post at this address. It may have been renamed or never existed.</p>
      <Link href="/blogs" className="button">
        See all posts
      </Link>
    </section>
  );
}
