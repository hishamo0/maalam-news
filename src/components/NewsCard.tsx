"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

type NewsCardProps = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  date: string;
  large?: boolean;
};

export default function NewsCard({
  slug,
  title,
  excerpt,
  image,
  category,
  author,
  date,
  large = false,
}: NewsCardProps) {
  const [imageError, setImageError] = useState(false);
  const router = useRouter();

  // ألوان التصنيفات
  const categoryStyles: Record<string, string> = {
    سياسة: "text-red-500 border-red-500",
    اقتصاد: "text-sky-400 border-sky-400",
    تكنولوجيا: "text-indigo-400 border-indigo-400",
    ثقافة: "text-green-500 border-green-500",
  };
  /* =========================================================
   ألوان الـ hover حسب التصنيف
========================================================= */

const hoverStyles: Record<string, string> = {

  سياسة:
    "hover:border-red-500/40",

  اقتصاد:
    "hover:border-sky-400/40",

  تكنولوجيا:
    "hover:border-indigo-400/40",

  ثقافة:
    "hover:border-green-500/40",

};
  // روابط التصنيفات
  const categoryLinks: Record<string, string> = {
    سياسة: "/category/politics",
    اقتصاد: "/category/economy",
    تكنولوجيا: "/category/technology",
    ثقافة: "/category/culture",
  };

  return (
    <Link href={`/news/${slug}`} className="block group h-full">
      <article
        className={`
          bg-[#111]
          rounded-2xl
          overflow-hidden
          border
          border-white/10
          transition-all
          duration-300
          hover:-translate-y-1
          h-full
          flex
          flex-col

          ${hoverStyles[category]}

          ${large ? "min-h-[520px]" : "min-h-[420px]"}
        `}
      >
        {/* الصورة */}
        <div
          className={`
            relative
            overflow-hidden
            aspect-video
          `}
        >
          <Image
            src={
              imageError
                ? "https://placehold.co/1200x800/111111/FFFFFF?text=Maalam"
                : image
            }
            alt={title}
            fill
            className="
              object-cover
              transition-transform
              duration-500
              group-hover:scale-105
            "
            onError={() => setImageError(true)}
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        </div>

        {/* المحتوى */}
        <div className="flex flex-col flex-1 p-5">
          {/* التصنيف */}
          <div className="mb-3">
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

              router.push(
                categoryLinks[category] || "/category/general"
              );
              }}
              className={`
                text-sm
                font-bold
                border-b-2
                pb-1
                inline-block
                w-fit
                cursor-pointer
                transition-opacity
                hover:opacity-80

                ${categoryStyles[category] || "text-white border-white"}
              `}
            >
              {category}
            </div>
          </div>

          {/* العنوان */}
          <h2
            className={`
              font-extrabold
              leading-tight
              mb-3
              text-white
              transition-colors
              duration-300
              line-clamp-2

            ${

              category === "سياسة"
                ? "group-hover:text-red-500"

                : category === "اقتصاد"
                ? "group-hover:text-sky-400"

                : category === "تكنولوجيا"
                ? "group-hover:text-indigo-400"

                : "group-hover:text-green-500"

            }

              ${large ? "text-3xl" : "text-xl"}
            `}
          >
            {title}
          </h2>

          {/* الوصف */}
          <p
            className={`
              text-gray-300
              leading-relaxed
              mb-5
              flex-1
              line-clamp-2

              ${large ? "text-base" : "text-sm"}
            `}
          >
            {excerpt}
          </p>

          {/* التاريخ */}
<div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
  <span className="text-xs text-gray-400">
    بواسطة {author}
  </span>

  <span className="text-xs text-gray-500">
    {date}
  </span>
</div>
        </div>
      </article>
    </Link>
  );
}
