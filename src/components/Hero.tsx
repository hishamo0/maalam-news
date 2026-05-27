"use client";

import { useEffect, useState } from "react";

import { news } from "@/data/news";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {

  /* =====================================================
     السلايدر
  ===================================================== */

  const [currentIndex, setCurrentIndex] = useState(0);

  /* =====================================================
     تبديل تلقائي للأخبار
  ===================================================== */

  useEffect(() => {

    const interval = setInterval(() => {

      setCurrentIndex((prev) =>

        prev === 4 ? 0 : prev + 1

      );

    }, 5000);

    return () => clearInterval(interval);

  }, []);

  /* =====================================================
     المقال الرئيسي الحالي
  ===================================================== */

  const heroArticle = news[currentIndex];

  /* =====================================================
     الأخبار الجانبية
  ===================================================== */

  const sideArticles = news.slice(1, 3);

  /* =====================================================
     ألوان التصنيفات
  ===================================================== */

  const categoryStyles: Record<string, string> = {

    سياسة: "text-red-500",

    اقتصاد: "text-sky-400",

    تكنولوجيا: "text-indigo-400",

    ثقافة: "text-green-500",

  };

  /* =====================================================
     ألوان الهوفر
  ===================================================== */

  const hoverStyles: Record<string, string> = {

    سياسة: "group-hover:text-red-500",

    اقتصاد: "group-hover:text-sky-400",

    تكنولوجيا: "group-hover:text-indigo-400",

    ثقافة: "group-hover:text-green-500",

  };

  return (

    <section className="w-full px-4 py-10">

      {/* =================================================
         Grid Layout
      ================================================= */}

      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-3
          gap-6
        "
      >

        {/* =============================================
           المقال الرئيسي
        ============================================== */}

        <div
          className="
            xl:col-span-2
            bg-zinc-900
            overflow-hidden
            group
            rounded-3xl
            relative
          "
        >

          <Link href={`/news/${heroArticle.slug}`}>

            {/* الصورة */}

            <div className="overflow-hidden">

              <Image
                key={heroArticle.slug}
                src={heroArticle.image}
                alt={heroArticle.title}
                width={1400}
                height={800}
                priority
                className="
                  w-full
                  h-[320px]
                  md:h-[500px]
                  object-cover
                  transition-all
                  duration-700
                  group-hover:scale-105
                "
              />

            </div>

            {/* المحتوى */}

            <div className="p-6 md:p-10">

              {/* التصنيف */}

              <span
                className={`
                  font-semibold
                  text-lg

                  ${categoryStyles[heroArticle.category]}
                `}
              >

                {heroArticle.category}

              </span>

              {/* العنوان */}

              <h1
                className={`
                  text-3xl
                  md:text-6xl
                  font-extrabold
                  leading-tight
                  mt-6
                  transition-colors
                  duration-300

                  ${hoverStyles[heroArticle.category]}
                `}
              >

                {heroArticle.title}

              </h1>

              {/* الوصف */}

              <p
                className="
                  text-zinc-400
                  text-lg
                  md:text-xl
                  leading-relaxed
                  mt-8
                  max-w-3xl
                "
              >

                {heroArticle.excerpt}

              </p>

            </div>

          </Link>

          {/* =============================================
             مؤشرات السلايدر
          ============================================== */}

          <div
            className="
              absolute
              bottom-5
              left-1/2
              -translate-x-1/2
              flex
              items-center
              gap-2
            "
          >

            {[0, 1, 2, 3, 4].map((index) => (

              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`
                  h-2
                  rounded-full
                  transition-all
                  duration-300

                  ${currentIndex === index
                    ? "w-8 bg-white"
                    : "w-2 bg-white/40"}
                `}
              />

            ))}

          </div>

        </div>

        {/* =============================================
           الأخبار الجانبية
        ============================================== */}

        <div
          className="
            flex
            flex-col
            gap-6
          "
        >

          {sideArticles.map((article) => (

            <Link
              key={article.slug}
              href={`/news/${article.slug}`}
              className="
                bg-zinc-900
                rounded-3xl
                overflow-hidden
                group
                flex-1
              "
            >

              {/* الصورة */}

              <div className="overflow-hidden">

                <Image
                  src={article.image}
                  alt={article.title}
                  width={800}
                  height={500}
                  className="
                    w-full
                    h-[220px]
                    object-cover
                    transition-transform
                    duration-700
                    group-hover:scale-105
                  "
                />

              </div>

              {/* المحتوى */}

              <div className="p-5">

                {/* التصنيف */}

                <span
                  className={`
                    text-sm
                    font-semibold

                    ${categoryStyles[article.category]}
                  `}
                >

                  {article.category}

                </span>

                {/* العنوان */}

                <h2
                  className={`
                    text-2xl
                    font-bold
                    leading-tight
                    mt-4
                    transition-colors
                    duration-300

                    ${hoverStyles[article.category]}
                  `}
                >

                  {article.title}

                </h2>

              </div>

            </Link>

          ))}

        </div>

      </div>

    </section>

  );

}