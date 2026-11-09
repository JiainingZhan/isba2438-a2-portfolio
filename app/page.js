import Link from "next/link";

export default function HomePage() {
  return (
    <section className="hero">
      <h1>Hi, I&apos;m Joy (Jianing Zhan).</h1>
      <p className="subheading">
        MSIS &apos;27 at Santa Clara University — Product, Data &amp; GTM Strategy | Enterprise AI.
      </p>
      <p>I turn data into products people can use — from deli queues to EV dashboards.</p>
      <div className="button-row">
        <Link href="/projects" className="button">
          View My Projects
        </Link>
        <Link href="/contact-me-server-form" className="button button-outline">
          Contact Me
        </Link>
      </div>
    </section>
  );
}
