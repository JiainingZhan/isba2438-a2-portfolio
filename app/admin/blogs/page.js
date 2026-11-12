import BlogAdmin from "@/components/BlogAdmin";

export const metadata = { title: "Blog Admin — Joy (Jianing Zhan)" };

export default function AdminBlogsPage() {
  return (
    <section>
      <h1>Blog Admin</h1>
      <p>
        Publish new posts, then edit or remove existing ones. Everything goes through the{" "}
        <code>/api/blogs</code> route handlers and saves to <code>data/blogs.json</code>.
      </p>
      <BlogAdmin />
    </section>
  );
}
