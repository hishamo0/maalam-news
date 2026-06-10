"use client";

import { useState } from "react";
import Image from "next/image";

type BenchmarkSliderProps = {
  images: string[];
};

export default function BenchmarkSlider({
  images,
}: BenchmarkSliderProps) {
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prev = () => {
    setCurrent((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  return (
    <div className="my-10">

      <div className="relative overflow-hidden rounded-2xl border border-zinc-700">

        <Image
          src={images[current]}
          alt="Benchmark Image"
          width={1600}
          height={900}
          className="w-full h-auto"
        />

        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/70 text-white px-3 py-2 rounded-full"
        >
          ←
        </button>

        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/70 text-white px-3 py-2 rounded-full"
        >
          →
        </button>

      </div>

      <div className="flex justify-center gap-2 mt-4">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full ${
              current === index
                ? "bg-red-500"
                : "bg-zinc-500"
            }`}
          />
        ))}
      </div>

    </div>
  );
}