

import { news } from "@/data/news";
import { notFound } from "next/navigation";

import Header from "@/components/Header";
import NewsCard from "@/components/NewsCard";
import ShareButtons from "@/components/ShareButtons";

import Image from "next/image";
import Link from "next/link";

import ReadingProgress from "@/components/ReadingProgress";

import type { Metadata } from "next";

    /* =====================================================
    
  ===================================================== */

  const createSlug = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");


/* =========================================================
   نوع البيانات الخاصة بالصفحة
========================================================= */

type Props = {
  params: {
    slug: string;
  };
};

/* =========================================================
   Dynamic SEO Metadata
========================================================= */

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {

  const { slug } = params;

  const article = news.find(
    (a) => a.slug === slug
  );

  if (!article) {

    return {
      title: "المقال غير موجود",
    };

  }


  /* =====================================================
     تنظيف النص من HTML
  ===================================================== */

  const cleanDescription =
    article.content
      .replace(/<[^>]*>/g, "")
      .slice(0, 160);

  return {

    title: article.title,

    description: cleanDescription,

    alternates: {
      canonical: `https://maalam.net/news/${article.slug}`,
    },

    openGraph: {

      siteName: "Maalam", locale: "ar_AR",

      title: `${article.title} | Maalam`,

      description: cleanDescription,

      url: `https://maalam.net/news/${article.slug}`,

      images: [
        {
          url: article.image,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],

      type: "article",
    },

    twitter: {

      card: "summary_large_image",

      title: `${article.title} | Maalam`,

      description: cleanDescription,

      images: [article.image],
    },

  };

}

/* =========================================================
   صفحة المقال
========================================================= */

export default async function ArticlePage({
  params,
}: Props) {

  /* =====================================================
     جلب الـ slug من الرابط
  ===================================================== */

  const { slug } = await params;

  /* =====================================================
     البحث عن المقال الحالي
  ===================================================== */

  const article = news.find(
    (a) => a.slug === slug
  );

  /* =====================================================
     إذا المقال غير موجود
  ===================================================== */

  if (!article) {
    notFound();
  }

  const headings = Array.from(
  article.content.matchAll(/<h([23])>([\s\S]*?)<\/h\1>/g)
  ).map((match) => match[2]);
  /* =====================================================
     مقالات متعلقة
  ===================================================== */

  const relatedNews = news
    .filter(
      (item) =>
        item.category === article.category &&
        item.slug !== article.slug
    )
    .slice(0, 3);

  /* =====================================================
     ألوان التصنيفات
  ===================================================== */

  const categoryColor =

    article.category === "سياسة"
      ? "bg-red-500"

      : article.category === "اقتصاد"
      ? "bg-sky-400"

      : article.category === "تكنولوجيا"
      ? "bg-indigo-400"

      : "bg-green-500";

  return (
    <>
    <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: article.title,
      description: article.excerpt,
      image: [article.image],
      author: {
        "@type": "Organization",
        name: "Maalam",
      },
      publisher: {
        "@type": "Organization",
        name: "Maalam",
        logo: {
          "@type": "ImageObject",
          url: "https://maalam.net/logo.png",
        },
      },
    }),
  }}
/>

    <main className="bg-black text-white min-h-screen overflow-x-hidden scroll-smooth">

      {/* =================================================
         شريط تقدم القراءة
      ================================================= */}

      <ReadingProgress
      color={categoryColor}
      />

      {/* =================================================
         الهيدر
      ================================================= */}

      <Header />

      {/* =================================================
         Hero المقال
      ================================================= */}

      <section className="relative w-full h-[70vh] overflow-hidden">

        <Image
          src={article.image}
          alt={article.title}
          fill
          priority
          className="object-cover"
        />

        {/* =============================================
           طبقة التعتيم
        ============================================== */}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20" />

        {/* =============================================
           محتوى الـ Hero
        ============================================== */}

        <div className="absolute bottom-0 left-0 w-full">

          <div className="max-w-6xl mx-auto px-4 md:px-8 pb-16">

            {/* التصنيف */}

            <span
              className={`
                text-sm
                font-bold
                border-b-2
                pb-1
                inline-block

                ${article.category === "سياسة"
                  ? "text-red-500 border-red-500"
                  : ""}

                ${article.category === "اقتصاد"
                  ? "text-sky-400 border-sky-400"
                  : ""}

                ${article.category === "تكنولوجيا"
                  ? "text-indigo-400 border-indigo-400"
                  : ""}

                ${article.category === "ثقافة"
                  ? "text-green-500 border-green-500"
                  : ""}
              `}
            >

              {article.category}

            </span>

            {/* Breadcrumbs */}

    <nav
      className="
        flex
        items-center
        flex-wrap
        gap-2
        text-sm
        text-zinc-400
        mb-6
      "
    >
  <Link href="/" className="hover:text-white transition-colors">
    الرئيسية
  </Link>

  <span>

<a href={`/category/${article.category}`}
className="hover:text-white transition-colors" >
  {article.category} </a>

  </span>

  <span className="text-zinc-300 line-clamp-1">
    {article.title}
  </span>
</nav>

            {/* العنوان */}

            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mt-6 max-w-5xl">

              {article.title}

            </h1>

            {/* معلومات المقال */}

            <div className="flex items-center gap-4 text-zinc-300 mt-6 text-sm">

              <span>
                {article.author}
              </span>

              <span>
                •
              </span>

              <span>
                {article.date}
              </span>

            </div>

            {/* =========================================================
               أزرار مشاركة المقال
            ========================================================= */}

            <div className="mt-6">

              <ShareButtons
                title={article.title}
              />

            </div>

          </div>

        </div>

      </section>

      {/* =================================================
         محتوى المقال Table of Content
      ================================================= */}

      <section className="w-full px-4 md:px-8 py-16">

        <div
            className="
              max-w-7xl
              mx-auto

              grid
              grid-cols-1
              lg:grid-cols-[280px_minmax(0,1fr)]

              gap-10
              items-start

              px-4
            "
          >

{/* TOC */}
<aside className="w-full h-fit lg:sticky lg:top-24">
  {headings.length > 0 && (
    <div
      className="
        mb-10
        rounded-3xl
        border
        border-white/10
        bg-white/5
        backdrop-blur-xl
        p-6
        md:p-8
        shadow-2xl
      "
    >
      {/* Mobile */}

<details open>
  <summary
    className="
      cursor-pointer
      text-lg
      md:text-2xl
      font-black
      text-white
      flex
      items-center
      gap-2
      select-none
    "
  >
    📑 اضغط لرؤية محتويات المقال
  </summary>

  <ul className="space-y-3 mt-6">
    {headings.map((heading, index) => (
      <li key={index}>
        <a
          href={`#${createSlug(heading)}`}
          className="
            block
            rounded-xl
            px-3
            py-2
            md:px-4
            md:py-3


            text-zinc-300
            hover:bg-white/5
            hover:text-white
            transition-all
            duration-300
          "
        >
          {heading}
        </a>
      </li>
    ))}
  </ul>
</details>
      </div>
  )}
</aside>



        
          <article
            className="
              prose
              prose-invert
              prose-lg

              max-w-none

              prose-headings:text-white
              prose-p:text-zinc-300
              prose-p:leading-loose

              prose-strong:text-white

              prose-h2:text-3xl
              prose-h2:mt-16
              prose-h2:mb-6

              prose-img:rounded-2xl

              prose-li:text-zinc-300

              prose-a:text-indigo-400

              prose-blockquote:border-indigo-500
            "
            dangerouslySetInnerHTML={{
            __html: article.content.replace(
              /<h([23])>([\s\S]*?)<\/h\1>/g,
              (_, level, title) =>
                `<h${level} id="${createSlug(title)}">${title}</h${level}>`
            ),
            }}
          />

        </div>

      </section>

      {/* =================================================
         الأخبار المتعلقة
      ================================================= */}

      <section className="w-full px-4 md:px-8 pb-24">

        <div className="max-w-7xl mx-auto">

          {/* =================================================
             عنوان القسم
          ================================================= */}

          <div className="flex items-center gap-3 mb-10">

            <div
              className={`
                w-1
                h-8
                rounded-full

                ${categoryColor}
              `}
            />

            <h2 className="text-3xl font-bold">

              أخبار ذات صلة

            </h2>

          </div>

          {/* =================================================
             الكروت
          ================================================= */}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">

            {relatedNews.map((item) => (

              <NewsCard
                key={item.slug}
                category={item.category}
                title={item.title}
                image={item.image}
                slug={item.slug}
                excerpt={item.excerpt}
                author={item.author}
                date={item.date}
              />

            ))}

          </div>

        </div>

      </section>

    </main>
  </>

  );

}
