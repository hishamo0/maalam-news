"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

/* =========================================================
   نوع البيانات الخاصة بالكرت
========================================================= */

type NewsCardProps = {
  title: string;
  category: string;
  image: string;
  slug: string;
  excerpt?: string;

  author: string;
  date?: string;
  large?: boolean;
};

/* =========================================================
   كومبوننت بطاقة الخبر
========================================================= */

export default function NewsCard({
  title,
  category,
  image,
  slug,
  excerpt,

  author,
  date,
  large = false,
}: NewsCardProps) {

  /* =========================================================
     حالة تحميل الصورة لإظهار Skeleton
  ========================================================= */

  const [loaded, setLoaded] = useState(false);

  return (

    /* =========================================================
       رابط الخبر
    ========================================================= */

    <Link
      href={`/news/${slug}`}
      className="block"
    >

      {/* =====================================================
         الكرت الرئيسي
      ===================================================== */}

      <article
        className={`
          relative
          group
          bg-zinc-900
          overflow-hidden
          rounded-3xl

          transition-all
          duration-300

          hover:-translate-y-2
          hover:bg-zinc-800
          hover:shadow-2xl

          w-full

          flex
          flex-col
        `}
      >

        {/* =====================================================
           Skeleton أثناء تحميل الصورة
        ===================================================== */}

        {!loaded && (

          <div
            className={`
              w-full
              ${large ? "h-[420px]" : "h-56"}
              bg-zinc-800
              animate-pulse
            `}
          />

        )}

        {/* =====================================================
           الصورة الرئيسية
        ===================================================== */}

        <div className="relative overflow-hidden">

          <Image
            onLoad={() => setLoaded(true)}
            src={image}
            alt={title}
            width={1200}
            height={700}
            className={`
              w-full
              ${large ? "h-[420px]" : "h-56"}
              object-cover

              transition-transform
              duration-500

              group-hover:scale-105

              ${loaded ? "block" : "hidden"}
            `}
          />

          {/* =================================================
             تدرج فوق الصورة
          ================================================= */}

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

        </div>

        {/* =====================================================
           محتوى الكرت
        ===================================================== */}

        <div className="p-5 flex flex-col gap-4">

          {/* =================================================
             التصنيف
          ================================================= */}

          <span
            className={`
              text-sm
              font-bold
              border-b-2
              pb-1
              inline-block
              w-fit

              ${category === "سياسة"
                ? "text-red-500 border-red-500"
                : ""}

              ${category === "اقتصاد"
                ? "text-sky-400 border-sky-400"
                : ""}

              ${category === "تكنولوجيا"
                ? "text-indigo-400 border-indigo-400"
                : ""}

              ${category === "ثقافة"
                ? "text-green-500 border-green-500"
                : ""}
            `}
          >
            {category}
          </span>

          {/* =================================================
             عنوان الخبر
          ================================================= */}

          <h3
            className={`
              font-bold
              leading-relaxed

              ${large
                ? "text-4xl line-clamp-3"
                : "text-2xl line-clamp-2"}
            `}
          >
            {title}
          </h3>

          {/* =================================================
             مقتطف الخبر
          ================================================= */}

          {excerpt && (

            <p
              className={`
                text-zinc-400
                leading-loose

                ${large
                  ? "text-lg"
                  : "text-sm line-clamp-2"}
              `}
            >
              {excerpt}
            </p>

          )}

          {/* =================================================
             معلومات الكاتب والتاريخ
          ================================================= */}

          <div className="flex items-center justify-between text-xs text-zinc-500 pt-2">

            <span>
              {author}
            </span>

            <span>
              {date}
            </span>

          </div>

        </div>

      </article>

    </Link>
  );
}