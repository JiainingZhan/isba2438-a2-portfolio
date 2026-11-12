import ContactAdmin from "@/components/ContactAdmin";

export const metadata = { title: "Contact Admin — Joy (Jianing Zhan)" };

export default function AdminContactsPage() {
  return (
    <section>
      <h1>Contact Admin</h1>
      <p>
        Every message sent through the contact forms, newest first. Edit a reply address or typo,
        or remove spam. Submissions live in <code>data/contacts.json</code>.
      </p>
      <ContactAdmin />
    </section>
  );
}
