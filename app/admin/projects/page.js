import ProjectAdmin from "@/components/ProjectAdmin";

export const metadata = { title: "Project Admin — Joy (Jianing Zhan)" };

export default function AdminProjectsPage() {
  return (
    <section>
      <h1>Project Admin</h1>
      <p>
        Add, edit, or remove portfolio projects. New projects get a slug generated from the title
        and appear on the public /projects page right away — no rebuild needed.
      </p>
      <ProjectAdmin />
    </section>
  );
}
