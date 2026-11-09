import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";

export const metadata = { title: "My Projects — Joy (Jianing Zhan)" };

export default function ProjectsPage() {
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
