import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";

const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "Maalam.net",
  description:
    "منصة إخبارية عربية حديثة تغطي السياسة والاقتصاد والتكنولوجيا والثقافة.",

  keywords: [
    "أخبار",
    "سياسة",
    "اقتصاد",
    "تكنولوجيا",
    "ثقافة",
    "أخبار عربية",
  ],

  authors: [
    {
      name: "Maalam.net",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.className} bg-black text-white`}>
        {children}
        <Footer />
      </body>
    </html>
  );
}