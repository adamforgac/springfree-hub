import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Springfree Email Generator",
  description: "Generátor e-mailových šablon pro Baselinker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs">
      <body>{children}</body>
    </html>
  );
}
