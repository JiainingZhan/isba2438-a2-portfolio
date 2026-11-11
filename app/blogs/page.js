import BlogList from "@/components/BlogList";

export const metadata = { title: "Blog — Joy (Jianing Zhan)" };

export default function BlogsPage() {
  return (
    <section>
      <h1>Blog</h1>
      <p>Short write-ups and notes, newest first.</p>
      <BlogList />
    </section>
  );
}
