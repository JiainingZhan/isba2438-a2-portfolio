import DeliMenu from "@/components/DeliMenu";

export const metadata = { title: "Deli Menu — Joy (Jianing Zhan)" };

export default function DeliPage() {
  return (
    <section>
      <h1>Deli Menu</h1>
      <p>
        Our Sunnyvale deli counter. The shop updates this list, so only items marked as available
        today are shown.
      </p>
      <DeliMenu />
    </section>
  );
}
