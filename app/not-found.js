import Link from "next/link";

export default function NotFound() {
  return (
    <section className="not-found">
      <h1>Page not found</h1>
      <p>The page you are looking for doesn&apos;t exist.</p>
      <Link href="/" className="button">
        Go home
      </Link>
    </section>
  );
}
