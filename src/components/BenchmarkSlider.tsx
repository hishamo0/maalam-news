"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type SliderImage = {
  src: string;
  alt?: string;
};

export default function BenchmarkSlider({
  images,
}: {
  images: SliderImage[];
}) {
  const [current, setCurrent] = useState(0);

  if (images.length === 0) return null;

  const goToPrevious = () => {
    setCurrent((index) =>
      index === 0 ? images.length - 1 : index - 1
    );
  };

  const goToNext = () => {
    setCurrent((index) => (index + 1) % images.length);
  };

  return (
    <div className="my-8">
      <div className="relative overflow-hidden border border-white/10 bg-zinc-950">
      <Image
        src={images[current].src}
        alt={images[current].alt || `Benchmark ${current + 1}`}
        width={1600}
        height={900}
        className="w-full aspect-video object-cover"
      />

        {images.length > 1 && (
          <>
        <button
          type="button"
          onClick={goToPrevious}
          className="
            absolute
            right-3
            top-1/2
            flex
            h-10
            w-10
            -translate-y-1/2
            items-center
            justify-center
            bg-black/70
            text-white
            transition-colors
            hover:bg-black
          "
          aria-label="الصورة السابقة"
        >
          <ChevronRight size={22} />
        </button>

        <button
          type="button"
          onClick={goToNext}
          className="
            absolute
            left-3
            top-1/2
            flex
            h-10
            w-10
            -translate-y-1/2
            items-center
            justify-center
            bg-black/70
            text-white
            transition-colors
            hover:bg-black
          "
          aria-label="الصورة التالية"
        >
          <ChevronLeft size={22} />
        </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2.5 transition-all ${
              current === i
                ? "w-8 bg-indigo-500"
                : "w-2.5 bg-zinc-600 hover:bg-zinc-400"
            }`}
            aria-label={`عرض صورة ${i + 1}`}
            aria-current={current === i}
          >
            <span className="sr-only">صورة {i + 1}</span>
          </button>
        ))}
      </div>
      )}
    </div>
  );
}
