"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

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

  const [loaded, setLoaded] = useState(false);

  return (

    <Link href={`/news/${slug}`} className="block h-full">

      <article
        className={`
          relative
          group
          bg-zinc-900
          overflow-hidden
          transition-all
          duration-300
          hover:-translate-y-2
          hover:bg-zinc-800
          hover:shadow-2xl
          rounded-3xl
          w-full
          h-full

          flex
          flex-col
        `}
      >

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

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

        </div>

        <div className="p-5 flex flex-col gap-4">

          <span
            className={`
              text-sm
              font-bold
              border-b-2
              pb-1
              inline-block
              w-fit

              ${category === "سياسة" ? "text-red-500 border-red-500" : ""}
              ${category === "اقتصاد" ? "text-sky-400 border-sky-400" : ""}
              ${category === "تكنولوجيا" ? "text-indigo-400 border-indigo-400" : ""}
              ${category === "ثقافة" ? "text-green-500 border-green-500" : ""}
            `}
          >
            {category}
          </span>

          <h3
            className={`
              font-bold
              leading-relaxed

              ${large
                ? "text-3xl line-clamp-2"
                : "text-xl line-clamp-2"}
            `}
          >
            {title}
          </h3>

          {excerpt && (
            <p
              className={`
                text-zinc-400
                leading-relaxed

${large
  ? "text-lg line-clamp-6"
  : "text-sm line-clamp-2"}
              `}
            >
              {excerpt}
            </p>
          )}

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