"use client";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import LatestNewsSlider from "@/components/LatestNewsSlider";
import NewsCard from "@/components/NewsCard";
import SectionTitle from "@/components/SectionTitle";
import TrendingSidebar from "@/components/TrendingSidebar";

import { news } from "@/data/news";

 /* =========================================================
      Metadata
========================================================= */


export default function Home() {
  const technologyNews = news.filter(
    (item) => item.category === "تكنولوجيا"
  );

  return (

    <main className="w-full min-h-screen bg-black text-white overflow-x-hidden">

<Header />

      <Hero />

      {/* الإعلان */}
      <section className="hidden">

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

      {/* الأكثر قراءة */}
      <section className="w-full px-4 md:px-8 pb-16">

        <div className="max-w-7xl mx-auto">

          <TrendingSidebar />

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

              <SectionTitle
                title="أحدث الأخبار"
                color="bg-red-500"
              />

              <LatestNewsSlider items={news} />

        </div>

      </section>

    </main>

  );
}
