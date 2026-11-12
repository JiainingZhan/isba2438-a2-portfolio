import Link from "next/link";

export const metadata = { title: "Admin — Joy (Jianing Zhan)" };

const adminLinks = [
  { href: "/admin/menu", title: "Deli Menu", description: "Menu items, prices, stock, and what is available today." },
  { href: "/admin/projects", title: "Projects", description: "Add, edit, or remove portfolio projects." },
  { href: "/admin/blogs", title: "Blog", description: "Publish, edit, or delete blog posts." },
  { href: "/admin/contacts", title: "Contact Submissions", description: "Review, edit, or remove messages from the contact forms." },
];

export default function AdminPage() {
  return (
    <section>
      <h1>Admin</h1>
      <p>Staff tools for the site. Everything here writes through the /api routes.</p>
      <div className="card-list">
        {adminLinks.map((link) => (
          <article key={link.href} className="card">
            <h2>
              <Link href={link.href}>{link.title}</Link>
            </h2>
            <p>{link.description}</p>
            <Link href={link.href} className="text-link">
              Open →
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
