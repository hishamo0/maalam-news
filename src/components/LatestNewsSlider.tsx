"use client";

import { useEffect, useState } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type LatestNewsSliderItem = {
  category: string;
  title: string;
  excerpt: string;
  image: string;
  slug: string;
  author: string;
  date: string;
};

type LatestNewsSliderProps = {
  items: LatestNewsSliderItem[];
};

const SLIDE_DELAY = 5000;
const FADE_DELAY = 240;

const categoryStyles: Record<string, { text: string; hover: string; ring: string }> = {
  سياسة: {
    text: "text-red-500",
    hover: "group-hover:text-red-500",
    ring: "focus-visible:ring-red-500",
  },
  اقتصاد: {
    text: "text-sky-400",
    hover: "group-hover:text-sky-400",
    ring: "focus-visible:ring-sky-400",
  },
  تكنولوجيا: {
    text: "text-indigo-400",
    hover: "group-hover:text-indigo-400",
    ring: "focus-visible:ring-indigo-400",
  },
  ثقافة: {
    text: "text-green-500",
    hover: "group-hover:text-green-500",
    ring: "focus-visible:ring-green-500",
  },
};

export default function LatestNewsSlider({ items }: LatestNewsSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isChanging, setIsChanging] = useState(false);

  const sliderItems = items.slice(0, 10);
  const article = sliderItems[currentIndex];
  const categoryStyle =
    categoryStyles[article?.category ?? ""] ?? categoryStyles.سياسة;

  const goToSlide = (index: number) => {
    if (index === currentIndex || sliderItems.length === 0) {
      return;
    }

    setIsChanging(true);

    window.setTimeout(() => {
      setCurrentIndex(index);
      setIsChanging(false);
    }, FADE_DELAY);
  };

  const goToNext = () => {
    goToSlide((currentIndex + 1) % sliderItems.length);
  };

  const goToPrevious = () => {
    goToSlide(
      currentIndex === 0 ? sliderItems.length - 1 : currentIndex - 1
    );
  };

  useEffect(() => {
    if (sliderItems.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setIsChanging(true);

      window.setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % sliderItems.length);
        setIsChanging(false);
      }, FADE_DELAY);
    }, SLIDE_DELAY);

    return () => window.clearInterval(interval);
  }, [sliderItems.length]);

  if (!article) {
    return null;
  }

  return (
    <div className="overflow-hidden border border-white/10 bg-zinc-950">
      <div className="relative">
        <Link href={`/news/${article.slug}`} className="group block">
          <div className="relative h-[380px] overflow-hidden sm:h-[460px] lg:h-[540px]">
            <Image
              key={article.slug}
              src={article.image}
              alt={article.title}
              fill
              sizes="(min-width: 1280px) calc(100vw - 440px), 100vw"
              className={`object-cover transition-all duration-700 ease-in-out ${
                isChanging ? "scale-105 opacity-0" : "scale-100 opacity-100"
              } group-hover:scale-105`}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 lg:p-8">
              <span
                className={`text-sm font-bold sm:text-base ${categoryStyle.text}`}
              >
                {article.category}
              </span>

              <h3
                className={`mt-3 text-2xl font-extrabold leading-tight text-white transition-colors duration-300 sm:text-3xl lg:text-4xl ${categoryStyle.hover}`}
              >
                {article.title}
              </h3>

              <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-zinc-200 sm:text-base lg:text-lg">
                {article.excerpt}
              </p>

              <div className="mt-5 flex items-center justify-between border-t border-white/15 pt-4 text-xs text-zinc-300">
                <span>{article.author}</span>
                <span className={`font-semibold ${categoryStyle.text}`}>
                  {article.date}
                </span>
              </div>
            </div>
          </div>
        </Link>

        <button
          type="button"
          onClick={goToPrevious}
          aria-label="الخبر السابق"
          className={`absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-black/55 text-white backdrop-blur-sm transition hover:bg-black/75 focus-visible:outline-none focus-visible:ring-2 ${categoryStyle.ring}`}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={goToNext}
          aria-label="الخبر التالي"
          className={`absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-black/55 text-white backdrop-blur-sm transition hover:bg-black/75 focus-visible:outline-none focus-visible:ring-2 ${categoryStyle.ring}`}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-white/10 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-2">
          {sliderItems.map((item, index) => (
            <button
              key={item.slug}
              type="button"
              onClick={() => goToSlide(index)}
              aria-label={`عرض الخبر ${index + 1}`}
              className={`h-2 transition-all ${
                currentIndex === index ? "w-8 bg-white" : "w-2 bg-white/35"
              }`}
            />
          ))}
        </div>

        <span className="text-sm font-semibold text-zinc-400">
          {currentIndex + 1} / {sliderItems.length}
        </span>
      </div>
    </div>
  );
}
