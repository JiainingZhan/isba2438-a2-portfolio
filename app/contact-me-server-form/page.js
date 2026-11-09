import ContactForm from "@/components/ContactForm";

export const metadata = { title: "Contact Me — Joy (Jianing Zhan)" };

export default function ContactMeServerFormPage() {
  return (
    <section>
      <h1>Contact Me</h1>
      <p>
        Send me a message. Your submission goes to a server action, is validated on the server, and
        is saved to <code>data/contacts.json</code>.
      </p>
      <ContactForm />
    </section>
  );
}
