import type { Metadata } from "next";

// Applies to every /admin/* route — internal operator tooling, never meant
// to be crawlable or appear in search results.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return children;
}
