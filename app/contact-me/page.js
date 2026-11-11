import ApiContactForm from "@/components/ApiContactForm";

export const metadata = { title: "Contact Me — Joy (Jianing Zhan)" };

export default function ContactMePage() {
  return (
    <section>
      <h1>Contact Me</h1>
      <p>
        Send me a message. This form posts to the <code>/api/contact</code> route handler, which
        validates on the server and saves to <code>data/contacts.json</code>.
      </p>
      <ApiContactForm />
    </section>
  );
}
