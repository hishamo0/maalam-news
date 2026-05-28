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
  const [isChanging, setIsChanging] = useState(false)

  /* =====================================================
     تبديل تلقائي للأخبار
  ===================================================== */

  useEffect(() => {

    const interval = setInterval(() => {

      setIsChanging(true);

    setTimeout(() => {
      setCurrentIndex((prev) =>
        prev === 4 ? 0 : prev + 1
      );

      setIsChanging(false);
    }, 300);

    }, 5000);

    return () => clearInterval(interval);

  }, []);

  /* =====================================================
     المقال الحالي
  ===================================================== */

  const heroArticle = news[currentIndex];

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

    <section className="w-full px-4 py-8">

      {/* =================================================
         السلايدر الرئيسي
      ================================================= */}

      <div
        className="
          bg-zinc-900
          overflow-hidden
          group
          rounded-3xl
          relative

          transition-all
          duration-500
        "
      >

        <Link href={`/news/${heroArticle.slug}`}>

          {/* =============================================
             الصورة
          ============================================== */}

          <div className="relative overflow-hidden">

            <Image
              key={heroArticle.slug}
              src={heroArticle.image}
              alt={heroArticle.title}
              width={1600}
              height={900}
              priority
            className={`
                        w-full
                        h-[260px]
                        md:h-[420px]
                        object-cover
                        transition-all
                        duration-700
                        ease-in-out
                        ${
                          isChanging
                            ? "opacity-0 scale-105"
                            : "opacity-100 scale-100"
                        }
                        group-hover:scale-105
                      `}
                      />

          </div>

          {/* =============================================
             المحتوى
          ============================================== */}

          <div className="p-6 md:p-10 min-h-[220px]">

            {/* التصنيف */}

            <span
              className={`
                text-sm
                md:text-base
                font-semibold

                ${categoryStyles[heroArticle.category]}
              `}
            >

              {heroArticle.category}

            </span>

            {/* العنوان */}

            <h1
              className={`
                text-2xl
                md:text-3xl
                font-extrabold
                line-clamp-2
               md:line-clamp-1
                leading-tight
                mt-5

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
                text-base
                md:text-lg
                line-clamp-2
                md:line-clamp-1
                leading-relaxed
                mt-6
                max-w-4xl
              "
            >

              {heroArticle.excerpt}

            </p>

          </div>
          <button
                  onClick={(e) => {
                    e.preventDefault();

                    setCurrentIndex((prev) =>
                      prev === 0 ? 4 : prev - 1
                    );
                  }}
                  className="
                    absolute
                    top-1/2
                    left-4
                    -translate-y-1/2
                    z-20

                    w-8
                    h-8
                    md:w-10
                    md:h-10

                    rounded-full
                    bg-black/50
                    backdrop-blur-sm

                    text-white
                    text-xl

                    flex
                    items-center
                    justify-center

                    opacity-100
                    md:opacity-0
                    md:group-hover:opacity-100

                    transition-all
                    duration-300
                  "
                >
                  ←
                </button>

                <button
                  onClick={(e) => {
                    e.preventDefault();

                    setCurrentIndex((prev) =>
                      prev === 4 ? 0 : prev + 1
                    );
                  }}
                  className="
                    absolute
                    top-1/2
                    right-4
                    -translate-y-1/2
                    z-20

                    w-8
                    h-8
                    md:w-10
                    md:h-10

                    rounded-full
                    bg-black/50
                    backdrop-blur-sm

                    text-white
                    text-xl

                    flex
                    items-center
                    justify-center

                    opacity-100
                    md:opacity-0
                    md:group-hover:opacity-100

                    transition-all
                    duration-300
                  "
                >
                  →
                </button>

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

    </section>

  );

}