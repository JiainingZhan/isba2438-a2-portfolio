import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/about-me", label: "About Me" },
  { href: "/projects", label: "My Projects" },
  { href: "/blogs", label: "Blogs" },
  { href: "/deli", label: "Deli" },
  { href: "/contact-me-server-form", label: "Contact Me" },
  { href: "/contact-me", label: "Contact Me (API)" },
];

export default function NavBar() {
  return (
    <header className="navbar">
      <nav className="container navbar-inner" aria-label="Main navigation">
        <Link href="/" className="brand">
          Joy Zhan
        </Link>
        <ul className="nav-links">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
