import type { Metadata } from "next";
import { Martian_Mono } from "next/font/google";
import "./globals.css";

const martianMono = Martian_Mono({
  variable: "--font-martian",
  subsets: ["latin"],
});

const BASE_URL = "https://digibouquet.vercel.app";

export const metadata: Metadata = {
  title: "digibouquet — send a digital flower bouquet",
  description:
    "Build a beautiful digital flower bouquet and send it to someone you love. Choose from roses, peonies, sunflowers, and more. Free, fun, and made with love.",
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: "digibouquet — send a digital flower bouquet",
    description:
      "Build a beautiful digital flower bouquet and send it to someone you love. Choose from roses, peonies, sunflowers, and more.",
    siteName: "digibouquet",
    images: ["https://assets.pauwee.com/other/metapreview.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "digibouquet — send a digital flower bouquet",
    description:
      "Build a beautiful digital flower bouquet and send it to someone you love. Choose from roses, peonies, sunflowers, and more.",
    images: ["https://assets.pauwee.com/other/metapreview.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${martianMono.variable}`}>
      <body className="font-martian">{children}</body>
    </html>
  );
}
