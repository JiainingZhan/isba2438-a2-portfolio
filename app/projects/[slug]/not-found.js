import Link from "next/link";

export default function ProjectNotFound() {
  return (
    <section className="not-found">
      <h1>Project not found</h1>
      <p>Sorry, there is no project at this address. It may have been renamed or never existed.</p>
      <Link href="/projects" className="button">
        See all projects
      </Link>
    </section>
  );
}
