import Link from "next/link";

export default function ProjectCard({ project }) {
  return (
    <article className="card">
      <h2>
        <Link href={`/projects/${project.slug}`}>{project.title}</Link>
      </h2>
      <p>{project.summary}</p>
      <Link href={`/projects/${project.slug}`} className="text-link">
        View details →
      </Link>
    </article>
  );
}
