import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";

const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {

        metadataBase: new URL("https://maalam.net"),

        title: {
          default: "Maalam.net",
          template: "%s | Maalam.net",
        },

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

        openGraph: {
          title: "Maalam.net",
          description:
            "منصة إخبارية عربية حديثة تغطي السياسة والاقتصاد والتكنولوجيا والثقافة.",

          url: "https://maalam.net",

          siteName: "Maalam.net",

          locale: "ar_AR",

          type: "website",
        },

        twitter: {
          card: "summary_large_image",

          title: "Maalam.net",

          description:
            "منصة إخبارية عربية حديثة تغطي السياسة والاقتصاد والتكنولوجيا والثقافة.",
        },

        icons: {
          icon: "/favicon.ico",
        },

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