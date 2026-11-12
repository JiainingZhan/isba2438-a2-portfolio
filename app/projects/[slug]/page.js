import Link from "next/link";
import { notFound } from "next/navigation";
import { loadProjects } from "@/server/projectStore";

export const dynamic = "force-dynamic";

async function getProjectBySlug(slug) {
  const projects = await loadProjects();
  return projects.find((project) => project.slug === slug) ?? null;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  return { title: project ? `${project.title} — Joy (Jianing Zhan)` : "Project not found" };
}

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  // Unknown slug → show app/projects/[slug]/not-found.js instead of crashing.
  if (!project) {
    notFound();
  }

  return (
    <article>
      <Link href="/projects" className="text-link">
        ← Back to My Projects
      </Link>
      <h1>{project.title}</h1>
      <p className="subheading">{project.summary}</p>

      <h2>Stack</h2>
      <ul className="tag-list">
        {project.stack.map((item) => (
          <li key={item} className="tag">
            {item}
          </li>
        ))}
      </ul>

      <h2>Details</h2>
      <ul>
        {project.details.map((detail) => (
          <li key={detail}>{detail}</li>
        ))}
      </ul>

      <h2>Role</h2>
      <p>{project.role}</p>

      {project.repo && (
        <p>
          <a href={project.repo} target="_blank" rel="noopener noreferrer" className="button">
            View repository on GitHub
          </a>
        </p>
      )}
    </article>
  );
}
