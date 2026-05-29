"use client";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import NewsCard from "@/components/NewsCard";
import SectionTitle from "@/components/SectionTitle";
import TrendingSidebar from "@/components/TrendingSidebar";

import { news } from "@/data/news";
import { useState } from "react";

 /* =========================================================
      Metadata
========================================================= */

export const metadata = {
  title: "Maalam | آخر أخبار التقنية والسياسة والاقتصاد",

  description:
    "موقع معالم يقدم أحدث الأخبار والتحليلات في التقنية والسياسة والاقتصاد والثقافة.",

  openGraph: {
    title: "Maalam",
    description:
      "آخر أخبار التقنية والسياسة والاقتصاد والثقافة.",
    url: "https://maalam.net",
    siteName: "Maalam",
    locale: "ar_AR",
    type: "website",
  },


  twitter: {
    card: "summary_large_image",
    title: "Maalam",
    description:
      "آخر أخبار التقنية والسياسة والاقتصاد والثقافة.",
  },


};


export default function Home() {
  /* =========================================================
   تخزين قيمة البحث
========================================================= */

const [search, setSearch] = useState("");

  const filteredNews = news.filter((item) =>
    item.title
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const technologyNews = news.filter(
    (item) => item.category === "تكنولوجيا"
  );

  return (

    <main className="w-full min-h-screen bg-black text-white overflow-x-hidden">

<Header />

      <Hero />

      {/* الإعلان */}
      <section className="w-full px-4 md:px-8 py-8">

        <div
          className="
            w-full
            max-w-7xl
            mx-auto
            h-32
            border
            border-zinc-800
            bg-zinc-950
            rounded-2xl
            flex
            items-center
            justify-center
            text-zinc-500
            text-lg
          "
        >

          مساحة إعلانية 970x250

        </div>

      </section>

      {/* قسم التكنولوجيا */}
      <section className="w-full px-4 md:px-8 pb-24">

        <div className="max-w-7xl mx-auto">

          <SectionTitle
            title="تكنولوجيا"
            color="bg-indigo-400"
          />

          <div
            className="
              bg-zinc-950/80
              border
              border-indigo-500/20
              rounded-3xl
              p-6
              md:p-8
              shadow-[0_0_40px_rgba(79,70,229,0.08)]
            "
          >

<div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-stretch">

{/* المقال الكبير */}
<div className="xl:col-span-2 h-full">

  {technologyNews
    .slice(0, 1)
    .map((item, index) => (

      <NewsCard
        large={true}
        key={index}
        category={item.category}
        title={item.title}
        image={item.image}
        slug={item.slug}

        excerpt={
          item.content
            ?.replace(/<[^>]*>/g, "")
            .slice(0, 850)
        }

        author={item.author}
        date={item.date}
      />

  ))}

</div>

  {/* المقالات الصغيرة */}
  <div className="space-y-8 h-full flex flex-col">

    {technologyNews
      .slice(1, 3)
      .map((item, index) => (

        <div className="flex-1" key={index}>

          <NewsCard
            category={item.category}
            title={item.title}
            image={item.image}
            slug={item.slug}
            excerpt={item.excerpt}
            author={item.author}
            date={item.date}
          />

        </div>

    ))}

  </div>

</div>

          </div>

        </div>

      </section>

      {/* أحدث الأخبار */}
      <section className="w-full px-4 md:px-8 pb-16">

        <div className="max-w-7xl mx-auto">

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-12 items-start">

            {/* الأخبار */}
            <div>

              <SectionTitle
                title="أحدث الأخبار"
                color="bg-red-500"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {filteredNews.map((item) => (

                  <NewsCard
                    key={item.slug}
                    category={item.category}
                    title={item.title}
                    image={item.image}
                    slug={item.slug}
                    excerpt={item.excerpt}
                    author={item.author}
                    date={item.date}
                  />

                ))}

              </div>

            </div>

            {/* الشريط الجانبي */}
            <TrendingSidebar />

          </div>

        </div>

      </section>

    </main>

  );
}