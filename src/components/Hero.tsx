"use client";

import { useEffect, useMemo, useState } from "react";

import { news } from "@/data/news";
import Image from "next/image";
import Link from "next/link";

const SLIDE_DELAY = 5000;
const FADE_DELAY = 280;
const THUMBNAIL_COUNT = 4;

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isChanging, setIsChanging] = useState(false);

  const heroArticle = news[currentIndex];

  const thumbnailIndexes = useMemo(
    () =>
      Array.from({ length: THUMBNAIL_COUNT }, (_, index) =>
        (currentIndex + index + 1) % news.length
      ),
    [currentIndex]
  );

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
        setCurrentIndex((prev) => (prev + 1) % news.length);
        setIsChanging(false);
      }, FADE_DELAY);
    }, SLIDE_DELAY);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="w-full px-4 py-8">
      <div className="mx-auto grid max-w-7xl gap-3 [direction:ltr] lg:grid-cols-[minmax(180px,0.46fr)_minmax(0,1fr)]">
        <div className="order-2 grid grid-cols-2 gap-3 [direction:rtl] lg:order-1 lg:grid-cols-1">
          {thumbnailIndexes.map((index) => {
            const article = news[index];

            return (
              <button
                key={article.slug}
                type="button"
                onClick={() => goToSlide(index)}
                aria-label={article.title}
                className="group relative h-[92px] overflow-hidden bg-zinc-900 outline-none transition duration-300 focus-visible:ring-2 focus-visible:ring-red-500 sm:h-[120px] lg:h-[128px]"
              >
                <Image
                  src={article.image}
                  alt=""
                  width={520}
                  height={292}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-black/10 transition duration-300 group-hover:bg-black/0" />
              </button>
            );
          })}
        </div>

        <Link
          href={`/news/${heroArticle.slug}`}
          className="group order-1 block overflow-hidden bg-zinc-900 [direction:rtl] lg:order-2"
        >
          <div className="relative h-[260px] overflow-hidden sm:h-[340px] lg:h-[548px]">
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

          <div className="bg-zinc-950 px-4 py-4 sm:px-6 lg:px-7">
            <span className="text-sm font-semibold text-red-500">
              {heroArticle.category}
            </span>

            <h1 className="mt-3 line-clamp-1 text-xl font-extrabold leading-tight transition-colors duration-300 group-hover:text-red-500 sm:text-2xl lg:text-3xl">
              {heroArticle.title}
            </h1>

            <p className="mt-3 line-clamp-1 text-sm leading-relaxed text-zinc-400 sm:text-base lg:text-lg">
              {heroArticle.excerpt}
            </p>
          </div>
        </Link>
      </div>
    </section>
  );
}
