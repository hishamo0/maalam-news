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

    <Link href={`/news/${slug}`}>

      <article className="
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
                        ">

        {!loaded && (
          <div className="w-full h-56 bg-zinc-800 animate-pulse"></div>
        )}

        <Image
          onLoad={() => setLoaded(true)}
          src={image}
          alt={title}
          width={600}
          height={400}
          className={`
            w-full
            ${large ? "h-[500px]" : "h-56"}
            object-cover
            transition-transform
            duration-500
            group-hover:scale-105

            ${loaded ? "block" : "hidden"}
          `}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>

        <div className="relative z-10 p-5">

          <span
            className={`
              text-sm
              font-bold
              border-b-2
              pb-1
              inline-block

              ${category === "سياسة" ? "text-red-500 border-red-500" : ""}
              ${category === "اقتصاد" ? "text-sky-400 border-sky-400" : ""}
              ${category === "تكنولوجيا" ? "text-indigo-400 border-indigo-400" : ""}
              ${category === "ثقافة" ? "text-green-500 border-green-500" : ""}
            `}
          >
            {category}
          </span>

          <h3 className="text-2xl font-bold line-clamp-2 leading-relaxed mt-3">
            {title}
          </h3>

          <p className="text-zinc-400 line-clamp-3 text-sm mt-4 leading-relaxed">
            {excerpt}
          </p>

          <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">

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