"use client";

import { Search, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

type HeaderProps = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
};

export default function Header({
  search,
  setSearch,
}: HeaderProps) {

  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {

    function handleClickOutside(event: MouseEvent) {

      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSearchOpen(false);
      }

      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
        ) {
        setMenuOpen(false);
        }
            }
    

     if 
        (searchOpen || menuOpen) {
        document.addEventListener("mousedown", handleClickOutside);
        }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, [searchOpen, menuOpen]);

  return (

    <>
    
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-black/50 backdrop-blur">

        <div className="w-full px-6 h-14 flex items-center justify-between">

          {/* Logo */}

          <div className="flex items-center gap-2">

            <Image
              src="/MAALAM_LOGO.png"
              alt="Maalam"
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
            />

            <h1 className="text-2xl font-extrabold">
              Maalam.net
            </h1>

          </div>

          {/* Desktop Nav */}

          <nav className="hidden md:flex flex-wrap items-center gap-6 text-zinc-300">

            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-zinc-300 hover:text-white transition"
            >
              <Search size={20} />
            </button>

            <Link
              href="/category/politics"
              className={`
                transition
                duration-300

                ${pathname === "/category/politics"
                ? "text-red-500"
                : "text-zinc-300 hover:text-red-500"}
              `}
            >
              سياسة
            </Link>

            <Link
              href="/category/economy"
              className={`
                transition
                duration-300

                ${pathname === "/category/economy"
                ? "text-sky-400"
                : "text-zinc-300 hover:text-sky-400"}
              `}
            >
              اقتصاد
            </Link>

            <Link
              href="/category/technology"
              className={`
                transition
                duration-300

                ${pathname === "/category/technology"
                ? "text-indigo-400"
                : "text-zinc-300 hover:text-indigo-400"}
              `}
            >
              تكنولوجيا
            </Link>

            <Link
              href="/category/culture"
              className={`
                transition
                duration-300

                ${pathname === "/category/culture"
                ? "text-green-500"
                : "text-zinc-300 hover:text-green-500"}
              `}
            >
              ثقافة
            </Link>

          </nav>

          {/* Mobile Menu Button */}

          <button
            aria-label="Open menu"
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white block md:hidden"
          >
            <Menu size={32} />
          </button>

        </div>

      </header>

      {/* Mobile Menu */}

      {menuOpen && (

        <div
        ref={menuRef}
        className="
          fixed
          top-16
          right-2
          w-56

          bg-black/40
          backdrop-blur-2xl

          border
          border-white/10

          rounded-2xl

          px-6
          py-6

          flex
          flex-col
          gap-6

          text-xl

          z-50

          shadow-[0_0_40px_rgba(0,0,0,0.6)]

          animate-[slideDown_.25s_ease]
          "
        >

          <Link
            href="/category/politics"
            className={`
              text-white
              transition
              duration-300

              hover:text-red-500

              ${pathname === "/category/politics"
              ? "!text-red-500"
              : ""}
            `}
          >
            سياسة
          </Link>

          <Link
            href="/category/economy"
            className={`
              text-white
              transition
              duration-300

              hover:text-sky-400

              ${pathname === "/category/economy"
              ? "!text-sky-400"
              : ""}
            `}
          >
            اقتصاد
          </Link>

          <Link
            href="/category/technology"
            className={`
              text-white
              transition
              duration-300

              hover:text-indigo-400

              ${pathname === "/category/technology"
              ? "!text-indigo-400"
              : ""}
            `}
          >
            تكنولوجيا
          </Link>

          <Link
            href="/category/culture"
            className={`
              text-white
              transition
              duration-300

              hover:text-green-500

              ${pathname === "/category/culture"
              ? "!text-green-500"
              : ""}
            `}
          >
            ثقافة
          </Link>

        </div>

      )}

      {/* Search Bar */}

      {searchOpen && (

        <div
          ref={searchRef}
          className="
          fixed
          top-14
          left-0
          w-full

          bg-black/70
          backdrop-blur-xl

          border-b
          border-zinc-800

          p-6

          z-50

          flex
          items-center
          gap-4

          animate-[slideDown_.25s_ease]
          "
        >

            <input
            type="text"
            placeholder="ابحث عن الأخبار..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
                w-full
                bg-zinc-900/80
                border
                border-zinc-700

                px-6
                py-4

                text-white

                outline-none

                focus:border-red-500

                transition
            "
            />

          <button
            aria-label="Open search"
            onClick={() => setSearchOpen(false)}
            className="
              text-zinc-400
              hover:text-white

              text-3xl

              transition
            "
          >
            ×
          </button>

        </div>

      )}

    </>

  );
}