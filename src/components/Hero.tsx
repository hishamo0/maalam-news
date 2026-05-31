"use client";

import { useEffect, useState } from "react";

import { news } from "@/data/news";
import Image from "next/image";
import Link from "next/link";

const SLIDE_DELAY = 5000;
const FADE_DELAY = 280;
const FEATURED_COUNT = 5;

const categoryStyles: Record<string, { text: string; hover: string }> = {
  سياسة: {
    text: "text-red-500",
    hover: "group-hover:text-red-500",
  },
  اقتصاد: {
    text: "text-sky-400",
    hover: "group-hover:text-sky-400",
  },
  تكنولوجيا: {
    text: "text-indigo-400",
    hover: "group-hover:text-indigo-400",
  },
  ثقافة: {
    text: "text-green-500",
    hover: "group-hover:text-green-500",
  },
};

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isChanging, setIsChanging] = useState(false);

  const featuredNews = news.slice(0, FEATURED_COUNT);
  const heroArticle = featuredNews[currentIndex];
  const categoryStyle = categoryStyles[heroArticle.category] ?? categoryStyles.سياسة;

  const goToSlide = (index: number) => {
    if (index === currentIndex) {
      return;
    }

    setIsChanging(true);

    window.setTimeout(() => {
      setCurrentIndex(index);
      setIsChanging(false);
    }, FADE_DELAY);
  };

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIsChanging(true);

      window.setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % featuredNews.length);
        setIsChanging(false);
      }, FADE_DELAY);
    }, SLIDE_DELAY);

    return () => window.clearInterval(interval);
  }, [featuredNews.length]);

  return (
    <section className="w-full px-2 py-6 sm:px-4 sm:py-8">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(86px,0.34fr)_minmax(0,1fr)] gap-2 [direction:ltr] sm:grid-cols-[minmax(150px,0.36fr)_minmax(0,1fr)] sm:gap-3 lg:grid-cols-[minmax(210px,0.42fr)_minmax(0,1fr)]">
        <div className="grid grid-cols-1 gap-2 [direction:rtl] sm:gap-3">
          {featuredNews.map((article, index) => {
            return (
              <button
                key={article.slug}
                type="button"
                onClick={() => goToSlide(index)}
                aria-label={article.title}
                className={`group relative h-[62px] overflow-hidden bg-zinc-900 outline-none transition duration-300 focus-visible:ring-2 focus-visible:ring-red-500 sm:h-[96px] lg:h-[124px] ${
                  currentIndex === index ? "ring-2 ring-red-500" : ""
                }`}
              >
                <Image
                  src={article.image}
                  alt=""
                  width={520}
                  height={292}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <span
                  className={`absolute inset-0 transition duration-300 group-hover:bg-black/0 ${
                    currentIndex === index ? "bg-black/0" : "bg-black/25"
                  }`}
                />
              </button>
            );
          })}
        </div>

        <Link
          href={`/news/${heroArticle.slug}`}
          className="group block overflow-hidden bg-zinc-900 [direction:rtl]"
        >
          <div className="relative h-[342px] overflow-hidden sm:h-[528px] lg:h-[668px]">
            <Image
              key={heroArticle.slug}
              src={heroArticle.image}
              alt={heroArticle.title}
              width={1600}
              height={900}
              priority
              className={`h-full w-full object-cover transition-all duration-700 ease-in-out ${
                isChanging ? "opacity-0 scale-105" : "opacity-100 scale-100"
              } group-hover:scale-105`}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 px-3 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
              <span
                className={`text-xs font-semibold sm:text-sm ${categoryStyle.text}`}
              >
                {heroArticle.category}
              </span>

              <h1
                className={`mt-2 text-base font-extrabold leading-tight text-white transition-colors duration-300 sm:mt-3 sm:text-2xl lg:text-4xl ${categoryStyle.hover}`}
              >
                {heroArticle.title}
              </h1>

              <p className="mt-2 line-clamp-1 text-xs leading-relaxed text-zinc-200 sm:mt-3 sm:text-base lg:text-lg">
                {heroArticle.excerpt}
              </p>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
