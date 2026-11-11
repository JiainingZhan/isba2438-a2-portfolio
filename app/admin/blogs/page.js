import BlogForm from "@/components/BlogForm";

export const metadata = { title: "New Blog Post — Joy (Jianing Zhan)" };

export default function AdminBlogsPage() {
  return (
    <section>
      <h1>New Blog Post</h1>
      <p>
        Write a post and publish it. This form posts to the <code>/api/blogs</code> route handler,
        which validates on the server and saves to <code>data/blogs.json</code>.
      </p>
      <BlogForm />
    </section>
  );
}
