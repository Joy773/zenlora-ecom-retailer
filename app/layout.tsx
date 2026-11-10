import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Providers from "@/components/providers";
import SiteShell from "@/components/site-shell";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zenlora",
  description: "Zenlora skincare retailer",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
      style={{ colorScheme: "light" }}
    >
      <body className={`${inter.className} flex min-h-full flex-col`}>
        <Providers>
          <SiteShell>{children}</SiteShell>
        </Providers>
      </body>
    </html>
  );
}
