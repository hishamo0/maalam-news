
"use client";
import Header from "@/components/Header";
import Hero from "@/components/Hero";

import NewsCard from "@/components/NewsCard";
import SectionTitle from "@/components/SectionTitle";
import TrendingSidebar from "@/components/TrendingSidebar";
import Image from "next/image";
import { news } from "@/data/news";
import { useState } from "react";

export default function Home() {

  const [search, setSearch] = useState("");

  const filteredNews = news.filter((item) =>
  item.title
  .toLowerCase()
  .includes(search.toLowerCase())
  );

  return (
   <main className="w-full bg-black text-white min-h-screen">

      <Header
          search={search}
          setSearch={setSearch}
      />

      <Hero />

  <section className="w-full px-4 md:px-8 py-8">

    <div className="
          w-full
          max-w-7xl
          mx-auto
          h-32
          border
          border-zinc-800
          bg-zinc-950
          flex
          items-center
          justify-center
          text-zinc-500
          text-lg
        ">

          مساحة إعلانية 970x250

    </div>

  </section>


      <section className="
                w-full
                px-4
                md:px-8
                pb-24
                ">

      <SectionTitle
        title="تكنولوجيا"
        color="bg-indigo-400"
      />

      <div className="
                  grid
                  grid-cols-1
                  lg:grid-cols-3
                  gap-8

                  bg-zinc-950/80
                  border
                  border-indigo-500/20
                  rounded-3xl
                  p-6
                  md:p-8

                  shadow-[0_0_40px_rgba(79,70,229,0.08)]
                  ">

        <div className="lg:col-span-2">

          <div className="overflow-hidden">

  <Image
    src="https://picsum.photos/1200/700?tech"
    alt="Technology"
    className="
      w-full
      h-[500px]
      object-cover
      transition-transform
      duration-700
      hover:scale-105
    "
  />

</div>

          <div className="mt-6">

            <span className="text-indigo-400 text-sm font-bold border-b-2 border-indigo-400 pb-1">
              تكنولوجيا
            </span>

            <h2 className="text-4xl font-extrabold leading-tight mt-6">
              الذكاء الاصطناعي يغيّر مستقبل الإعلام الرقمي
            </h2>

          </div>

        </div>

        <div className="space-y-8">

          <NewsCard
            category="تكنولوجيا"
            title="شركات التقنية تتسابق في تطوير نماذج الذكاء الاصطناعي"
            image="https://picsum.photos/600/400?11"
            slug="cloud-computing"
          />

          <NewsCard
            category="تكنولوجيا"
            title="تطورات جديدة في عالم الحوسبة السحابية"
            image="https://picsum.photos/600/400?12"
            slug="cloud-computing"
          />

        </div>

      </div>

    </section>

 <section className="w-full px-8 pb-10">

  <div className="grid grid-cols-1 xl:grid-cols-[1fr_350px] gap-12">

    <div>

      <SectionTitle
        title="أحدث الأخبار"
        color="bg-red-500"
      />


      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {filteredNews.map((item, index) => (
          <NewsCard
            key={item.slug}
            category={item.category}
            title={item.title}
            image={item.image}
            slug={item.slug}
          />
        ))}

      </div>

    </div>

    <TrendingSidebar />

  </div>

</section>




    </main>
  );
}