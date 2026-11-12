import ProjectCard from "@/components/ProjectCard";
import { loadProjects } from "@/server/projectStore";

export const dynamic = "force-dynamic";

export const metadata = { title: "My Projects — Joy (Jianing Zhan)" };

export default async function ProjectsPage() {
  const projects = await loadProjects();
  return (
    <section>
      <h1>My Projects</h1>
      <div className="card-list">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
