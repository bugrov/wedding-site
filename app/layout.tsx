import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

// Admin/UI chrome font — not a template font (each of the 5 client-site
// templates loads its own Cyrillic-verified pair, see the plan). Inter covers
// Cyrillic reliably, which is a hard requirement for this project.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Wedding Press",
  description: "Внутренний конструктор сайтов-приглашений на свадьбу",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
