
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



</div>

<div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

  <div className="xl:col-span-2">

    {news
      .filter((item) => item.category === "تكنولوجيا")
      .slice(0, 1)
      .map((item, index) => (

        <NewsCard
          key={index}
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

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                  <div className="space-y-8">

                    {news
                      .filter((item) => item.category === "تكنولوجيا")
                      .slice(1, 3)
                      .map((item, index) => (

                        <NewsCard
                          key={index}
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

                  <div className="xl:col-span-2">

                    {news
                      .filter((item) => item.category === "تكنولوجيا")
                      .slice(0, 1)
                      .map((item, index) => (

                        <NewsCard
                          key={index}
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

</div>

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
            excerpt={item.excerpt}
            author={item.author}
            date={item.date}
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