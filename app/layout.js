import "./globals.css";
import NavBar from "@/components/NavBar";

export const metadata = {
  title: "Joy (Jianing Zhan) — Portfolio",
  description: "Product, Data & GTM Strategy | Enterprise AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <main className="container">{children}</main>
        <footer className="footer">
          <div className="container">© 2026 Joy (Jianing Zhan)</div>
        </footer>
      </body>
    </html>
  );
}
