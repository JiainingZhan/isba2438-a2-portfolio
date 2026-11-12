import MenuAdmin from "@/components/MenuAdmin";

export const metadata = { title: "Menu Admin — Joy (Jianing Zhan)" };

export default function AdminMenuPage() {
  return (
    <section>
      <h1>Menu Admin</h1>
      <p>
        Staff view for the Sunnyvale deli. Edit items, mark what is available today (sausage is
        not made every day), and add or remove items. Changes save through{" "}
        <code>/api/menu</code>.
      </p>
      <MenuAdmin />
    </section>
  );
}
