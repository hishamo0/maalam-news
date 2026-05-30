"use client";

/* =========================================================
   Imports
========================================================= */

import Image from "next/image";
import Link from "next/link";

import { usePathname, useRouter } from "next/navigation";

import { useState } from "react";

import { Menu, Search, X } from "lucide-react";

/* =========================================================
   الهيدر الرئيسي
========================================================= */

export default function Header() {

  /* =======================================================
     حالات المينو والبحث
  ======================================================= */

  const [menuOpen, setMenuOpen] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);

  /* =======================================================
     تخزين النص المكتوب داخل البحث
  ======================================================= */

  const [search, setSearch] = useState("");

  /* =======================================================
     معرفة الصفحة الحالية
  ======================================================= */

  const pathname = usePathname();

  /* =======================================================
     التنقل داخل الموقع
  ======================================================= */

  const router = useRouter();

  /* =======================================================
     تنفيذ البحث
  ======================================================= */

  const handleSearch = (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    // منع البحث الفارغ
    if (!search.trim()) return;

    // الانتقال لصفحة البحث
    router.push(
      `/search?q=${encodeURIComponent(search)}`
    );

    // إغلاق نافذة البحث
    setSearchOpen(false);

  };

  return (

    <>

    <header
        className="
        fixed
        top-0
        left-0
        w-full
        z-50
        bg-black/90
        backdrop-blur-md
        border-b
        border-white/10
      "
    >

      {/* ===================================================
         الحاوية الرئيسية
      =================================================== */}

      <div
        className="
          max-w-7xl
          mx-auto
          px-4
          md:px-8
          h-14
          flex
          items-center
          justify-between
        "
      >

        {/* =================================================
           اللوجو
        ================================================= */}

        <Link
          href="/"
          className="
            flex
            items-center
            gap-3
            shrink-0
          "
        >

          <Image
            src="/MAALAM_LOGO.png"
            alt="Maalam"
            width={32}
            height={32}
            className="object-contain"
          />

          <span
            className="
              text-white
              font-black
              text-xl
              tracking-wide
            "
          >
            Maalam
          </span>

        </Link>

        {/* =================================================
           روابط الديسكتوب
        ================================================= */}

        <nav
          className="
            hidden
            md:flex
            flex-wrap
            items-center
            gap-6
            text-zinc-300
          "
        >

          <Link
            href="/category/politics"
            className={`
              transition-colors
              hover:text-red-500

              ${
                pathname === "/category/politics"
                  ? "text-red-500"
                  : ""
              }
            `}
          >
            سياسة
          </Link>

          <Link
            href="/category/economy"
            className={`
              transition-colors
              hover:text-sky-400

              ${
                pathname === "/category/economy"
                  ? "text-sky-400"
                  : ""
              }
            `}
          >
            اقتصاد
          </Link>

          <Link
            href="/category/technology"
            className={`
              transition-colors
              hover:text-indigo-400

              ${
                pathname === "/category/technology"
                  ? "text-indigo-400"
                  : ""
              }
            `}
          >
            تكنولوجيا
          </Link>

          <Link
            href="/category/culture"
            className={`
              transition-colors
              hover:text-green-500

              ${
                pathname === "/category/culture"
                  ? "text-green-500"
                  : ""
              }
            `}
          >
            ثقافة
          </Link>

        </nav>

        {/* =================================================
           أزرار البحث والموبايل
        ================================================= */}

        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          {/* ===============================================
             زر البحث
          =============================================== */}

          <button
            aria-label="Open search"
            onClick={() =>
              setSearchOpen(!searchOpen)
            }
            className="
              text-zinc-300
              hover:text-white
              transition-colors
            "
          >

            <Search size={20} />

          </button>

          {/* ===============================================
             زر الموبايل
          =============================================== */}

          <button
            aria-label="Open menu"
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
            className="
              md:hidden
              text-zinc-300
              hover:text-white
              transition-colors
            "
          >

            {menuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}

          </button>

        </div>

      </div>

      {/* ===================================================
         نافذة البحث
      =================================================== */}

      {searchOpen && (

        <div
          className="
            border-t
            border-white/10
            bg-black
            px-4
            py-4
          "
        >

          <form
            onSubmit={handleSearch}
            className="
              max-w-3xl
              mx-auto
              relative
            "
          >

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="ابحث عن الأخبار..."
              className="
                w-full
                bg-[#111]
                border
                border-white/10
                rounded-xl
                px-5
                py-3
                text-white
                outline-none
                focus:border-red-500
                transition-colors
              "
            />

          </form>

        </div>

      )}

    </header>

      {/* ===================================================
         مينو الموبايل
      =================================================== */}

{menuOpen && (

  <>

    <div
      className="
        fixed
        inset-0
        z-40
        md:hidden
      "
      onClick={() => setMenuOpen(false)}
    />

    <div
      onClick={(e) => e.stopPropagation()}
      className="
        fixed
        top-14
        right-0
        w-full
        z-50
        md:hidden
        border-t
        border-white/10
        bg-black
      "
    >

      <nav
        className="
          flex
          flex-col
          px-4
          py-4
          gap-4
        "
      >

        <Link
          href="/category/politics"
          onClick={() => setMenuOpen(false)}
          className="text-zinc-300 hover:text-red-500 transition-colors"
        >
          سياسة
        </Link>

        <Link
          href="/category/economy"
          onClick={() => setMenuOpen(false)}
          className="text-zinc-300 hover:text-sky-400 transition-colors"
        >
          اقتصاد
        </Link>

        <Link
          href="/category/technology"
          onClick={() => setMenuOpen(false)}
          className="text-zinc-300 hover:text-indigo-400 transition-colors"
        >
          تكنولوجيا
        </Link>

        <Link
          href="/category/culture"
          onClick={() => setMenuOpen(false)}
          className="text-zinc-300 hover:text-green-500 transition-colors"
        >
          ثقافة
        </Link>

      </nav>

    </div>

  </>

)}

    </>

  );

}
