"use client";

/* =========================================================
   Imports
========================================================= */

import { Copy, Send, Share2 } from "lucide-react";

/* =========================================================
   Props
========================================================= */

type ShareButtonsProps = {
  title: string;
};

/* =========================================================
   أزرار مشاركة المقال
========================================================= */

export default function ShareButtons({
  title,
}: ShareButtonsProps) {

  /* =======================================================
     رابط الصفحة الحالية
  ======================================================= */

  const url =
    typeof window !== "undefined"
      ? window.location.href
      : "";

  /* =======================================================
     مشاركة واتساب
  ======================================================= */

  const shareWhatsApp = () => {

    window.open(

      `https://wa.me/?text=${encodeURIComponent(
        title + " " + url
      )}`,

      "_blank"

    );

  };

  /* =======================================================
     مشاركة تلغرام
  ======================================================= */

  const shareTelegram = () => {

    window.open(

      `https://t.me/share/url?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(title)}`,

      "_blank"

    );

  };

  /* =======================================================
     نسخ الرابط
  ======================================================= */

  const copyLink = async () => {

    await navigator.clipboard.writeText(url);

    alert("تم نسخ الرابط");

  };

  return (

    <div
      className="
        flex
        items-center
        gap-3
        flex-wrap
      "
    >

      {/* ===============================================
         واتساب
      =============================================== */}

      <button
        onClick={shareWhatsApp}
        className="
          bg-green-500/10
          border
          border-green-500/30
          hover:bg-green-500/20
          transition-colors
          rounded-xl
          px-4
          py-2
          text-sm
          flex
          items-center
          gap-2
        "
      >

        <Share2 size={16} />

        واتساب

      </button>

      {/* ===============================================
         تلغرام
      =============================================== */}

      <button
        onClick={shareTelegram}
        className="
          bg-sky-500/10
          border
          border-sky-500/30
          hover:bg-sky-500/20
          transition-colors
          rounded-xl
          px-4
          py-2
          text-sm
          flex
          items-center
          gap-2
        "
      >

        <Send size={16} />

        تلغرام

      </button>

      {/* ===============================================
         نسخ الرابط
      =============================================== */}

      <button
        onClick={copyLink}
        className="
          bg-white/5
          border
          border-white/10
          hover:bg-white/10
          transition-colors
          rounded-xl
          px-4
          py-2
          text-sm
          flex
          items-center
          gap-2
        "
      >

        <Copy size={16} />

        نسخ الرابط

      </button>

    </div>

  );

}