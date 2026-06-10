"use client";

/* eslint-disable @next/next/no-img-element */

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";

type LightboxImage = {
  src: string;
  alt: string;
};

type LightboxState = {
  images: LightboxImage[];
  current: number;
};

const getImageSrc = (image: HTMLImageElement) =>
  image.currentSrc || image.src || image.getAttribute("src") || "";

export default function ArticleImageLightbox() {
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  const closeLightbox = () => setLightbox(null);

  const goToPrevious = () => {
    setLightbox((currentLightbox) => {
      if (!currentLightbox) return currentLightbox;

      return {
        ...currentLightbox,
        current:
          currentLightbox.current === 0
            ? currentLightbox.images.length - 1
            : currentLightbox.current - 1,
      };
    });
  };

  const goToNext = () => {
    setLightbox((currentLightbox) => {
      if (!currentLightbox) return currentLightbox;

      return {
        ...currentLightbox,
        current: (currentLightbox.current + 1) % currentLightbox.images.length,
      };
    });
  };

  useEffect(() => {
    const article = document.querySelector(".article-content");
    if (!article) return;

    const handleArticleClick = (event: Event) => {
      const target = event.target as HTMLElement | null;
      const clickedImage = target?.closest("img") as HTMLImageElement | null;

      if (!clickedImage || !article.contains(clickedImage)) return;

      event.preventDefault();

      const gallery = clickedImage.closest("[data-lightbox-gallery]");
      const galleryImages = gallery?.getAttribute("data-lightbox-images");

      if (galleryImages) {
        try {
          const parsedImages = JSON.parse(galleryImages) as LightboxImage[];
          const current =
            Number(clickedImage.getAttribute("data-lightbox-index")) || 0;

          setLightbox({
            images: parsedImages,
            current,
          });

          return;
        } catch {
          // Fall through to opening only the clicked image.
        }
      }

      setLightbox({
        images: [
          {
            src: getImageSrc(clickedImage),
            alt: clickedImage.alt || "",
          },
        ],
        current: 0,
      });
    };

    article.addEventListener("click", handleArticleClick);

    return () => {
      article.removeEventListener("click", handleArticleClick);
    };
  }, []);

  useEffect(() => {
    if (!lightbox) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeLightbox();
      }

      if (event.key === "ArrowRight") {
        goToPrevious();
      }

      if (event.key === "ArrowLeft") {
        goToNext();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightbox]);

  if (!lightbox) return null;

  const image = lightbox.images[lightbox.current];
  const hasMultipleImages = lightbox.images.length > 1;

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
      onClick={closeLightbox}
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
    >
      <button
        type="button"
        onClick={closeLightbox}
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
        aria-label="Close image preview"
      >
        <X size={22} />
      </button>

      {hasMultipleImages && (
        <>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              goToPrevious();
            }}
            className="
              fixed
              right-4
              top-1/2
              z-10
              flex
              h-12
              w-12
              -translate-y-1/2
              items-center
              justify-center
              border
              border-white/20
              bg-black/70
              text-white
              transition-colors
              hover:bg-white/10
            "
            aria-label="Previous image"
          >
            <ChevronRight size={26} />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              goToNext();
            }}
            className="
              fixed
              left-4
              top-1/2
              z-10
              flex
              h-12
              w-12
              -translate-y-1/2
              items-center
              justify-center
              border
              border-white/20
              bg-black/70
              text-white
              transition-colors
              hover:bg-white/10
            "
            aria-label="Next image"
          >
            <ChevronLeft size={26} />
          </button>
        </>
      )}

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

      {hasMultipleImages && (
        <div
          className="
            fixed
            bottom-4
            left-1/2
            -translate-x-1/2
            bg-black/70
            px-3
            py-1
            text-sm
            text-white
          "
        >
          {lightbox.current + 1} / {lightbox.images.length}
        </div>
      )}
    </div>
  );
}
