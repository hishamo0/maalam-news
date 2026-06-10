"use client";

import { useState } from "react";
import Image from "next/image";

export default function BenchmarkSlider({
  images,
}: {
  images: string[];
}) {
  const [current, setCurrent] = useState(0);

  return (
    <div className="my-8">
      <Image
        src={images[current]}
        alt="Benchmark"
        width={1600}
        height={900}
        className="rounded-2xl w-full"
      />

      <div className="flex justify-center gap-3 mt-4">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`px-4 py-2 rounded-lg ${
              current === i
                ? "bg-indigo-600"
                : "bg-zinc-700"
            }`}
          >
            {i === 0 ? "1080p" : i === 1 ? "1440p" : "4K"}
          </button>
        ))}
      </div>
    </div>
  );
}