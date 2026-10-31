import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import { COLORS } from "@/config/theme";
import { SITE } from "@/config/site";
import { profile } from "@/data/profile";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: profile.seo.title, template: `%s | ${profile.name}` },
  description: profile.seo.description,
  applicationName: SITE.shortName,
  authors: [{ name: profile.name }],
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: profile.seo.title,
    description: profile.seo.description,
    locale: SITE.locale,
    url: SITE.url,
  },
  twitter: { card: "summary_large_image", title: profile.seo.title, description: profile.seo.description },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: COLORS.bg,
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
