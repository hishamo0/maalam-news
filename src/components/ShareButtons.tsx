"use client";

/* =========================================================
   Imports
========================================================= */

import {
  FaWhatsapp,
  FaFacebookF,
  FaXTwitter,
} from "react-icons/fa6";

import { Copy } from "lucide-react";

import { useState } from "react";

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
     رسالة النسخ
  ======================================================= */

  const [copied, setCopied] = useState(false);

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
     مشاركة تويتر / X
  ======================================================= */

  const shareTwitter = () => {

    window.open(

      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        title
      )}&url=${encodeURIComponent(url)}`,

      "_blank"

    );

  };

  /* =======================================================
     مشاركة فيسبوك
  ======================================================= */

  const shareFacebook = () => {

    window.open(

      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}`,

      "_blank"

    );

  };

  /* =======================================================
     نسخ الرابط
  ======================================================= */

  const copyLink = async () => {

    await navigator.clipboard.writeText(url);

    // إظهار الرسالة
    setCopied(true);

    // إخفاء الرسالة بعد ثانيتين ونصف
    setTimeout(() => {

      setCopied(false);

    }, 2500);

  };

  return (

    <>

      {/* ===================================================
         أزرار المشاركة
      =================================================== */}

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

          <FaWhatsapp size={16} />
          واتساب

        </button>

        {/* ===============================================
           تويتر / X
        =============================================== */}

        <button
          onClick={shareTwitter}
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

          <FaXTwitter size={16} />

          تويتر

        </button>

        {/* ===============================================
           فيسبوك
        =============================================== */}

        <button
          onClick={shareFacebook}
          className="
            bg-blue-500/10
            border
            border-blue-500/30
            hover:bg-blue-500/20
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

          <FaFacebookF size={16} />

          فيسبوك

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

      {/* ===================================================
         رسالة النسخ
      =================================================== */}

      {copied && (

        <div
          className="
            fixed
            bottom-6
            left-1/2
            -translate-x-1/2
            bg-black/90
            backdrop-blur-xl
            border
            border-white/10
            text-white
            px-5
            py-3
            rounded-xl
            shadow-2xl
            z-[9999]
            text-sm
          "
        >

          تم نسخ الرابط بنجاح

        </div>

      )}

    </>

  );

}