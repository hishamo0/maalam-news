"use client";

/* eslint-disable @next/next/no-img-element */

import { X } from "lucide-react";
import { useEffect, useState } from "react";

type LightboxImage = {
  src: string;
  alt: string;
};

export default function ArticleImageLightbox() {
  const [image, setImage] = useState<LightboxImage | null>(null);

  useEffect(() => {
    const article = document.querySelector(".article-content");
    if (!article) return;

    const handleArticleClick = (event: Event) => {
      const target = event.target as HTMLElement | null;
      const clickedImage = target?.closest("img");

      if (!clickedImage || !article.contains(clickedImage)) return;

      event.preventDefault();

      setImage({
        src: clickedImage.currentSrc || clickedImage.src,
        alt: clickedImage.alt || "",
      });
    };

    article.addEventListener("click", handleArticleClick);

    return () => {
      article.removeEventListener("click", handleArticleClick);
    };
  }, []);

  useEffect(() => {
    if (!image) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setImage(null);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [image]);

  if (!image) return null;

  return (
    <div
      className="
        fixed
        inset-0
        z-[9999]
        flex
        items-center
        justify-center
        bg-black/90
        p-4
        backdrop-blur-sm
      "
      onClick={() => setImage(null)}
      role="dialog"
      aria-modal="true"
      aria-label="تكبير الصورة"
    >
      <button
        type="button"
        onClick={() => setImage(null)}
        className="
          fixed
          left-4
          top-4
          z-10
          flex
          h-11
          w-11
          items-center
          justify-center
          border
          border-white/20
          bg-black/70
          text-white
          transition-colors
          hover:bg-white/10
        "
        aria-label="إغلاق الصورة"
      >
        <X size={22} />
      </button>

      <img
        src={image.src}
        alt={image.alt}
        className="
          max-h-[92vh]
          max-w-[96vw]
          object-contain
          shadow-2xl
        "
        onClick={(event) => event.stopPropagation()}
      />
    </div>
  );
}
