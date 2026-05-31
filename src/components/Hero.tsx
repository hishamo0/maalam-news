"use client";

import { useEffect, useState } from "react";

import { news } from "@/data/news";
import Image from "next/image";
import Link from "next/link";

const SLIDE_DELAY = 5000;
const FADE_DELAY = 280;
const FEATURED_COUNT = 5;

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isChanging, setIsChanging] = useState(false);

  const featuredNews = news.slice(0, FEATURED_COUNT);
  const heroArticle = featuredNews[currentIndex];

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
          </div>

          <div className="bg-zinc-950 px-3 py-3 sm:px-5 sm:py-4 lg:px-7">
            <span className="text-xs font-semibold text-red-500 sm:text-sm">
              {heroArticle.category}
            </span>

            <h1 className="mt-2 line-clamp-1 text-sm font-extrabold leading-tight transition-colors duration-300 group-hover:text-red-500 sm:mt-3 sm:text-2xl lg:text-3xl">
              {heroArticle.title}
            </h1>

            <p className="mt-2 line-clamp-1 text-xs leading-relaxed text-zinc-400 sm:mt-3 sm:text-base lg:text-lg">
              {heroArticle.excerpt}
            </p>
          </div>
        </Link>
      </div>
    </section>
  );
}
