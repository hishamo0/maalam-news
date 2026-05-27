import { news } from "@/data/news";
import { notFound } from "next/navigation";

import Header from "@/components/Header";
import NewsCard from "@/components/NewsCard";

import Image from "next/image";

import type { Metadata } from "next";

/* =========================================================
   نوع البيانات الخاصة بالصفحة
========================================================= */

type Props = {
  params: Promise<{
    slug: string;
  }>;
};
/* =========================================================
   Dynamic SEO Metadata
========================================================= */

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {

  const { slug } = await params;

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

    title: article.title,

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

    title: article.title,

    description: cleanDescription,

    images: [article.image],
  },

};
  
};


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

  return (

    <main className="bg-black text-white min-h-screen overflow-x-hidden">

      {/* =================================================
         الهيدر
      ================================================= */}

      <Header
      />

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

          </div>

        </div>

      </section>

      {/* =================================================
         محتوى المقال
      ================================================= */}

      <section className="w-full px-4 md:px-8 py-16">

        <div className="max-w-4xl mx-auto">

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
              __html: article.content,
            }}
          />

        </div>

      </section>

      {/* =================================================
         الأخبار المتعلقة
      ================================================= */}

      <section className="w-full px-4 md:px-8 pb-24">

        <div className="max-w-7xl mx-auto">

          {/* عنوان القسم */}

          <div className="flex items-center gap-3 mb-10">

            <div className="w-1 h-8 bg-indigo-500 rounded-full" />

            <h2 className="text-3xl font-bold">
              أخبار متعلقة
            </h2>

          </div>

          {/* الكروت */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

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

  );
}