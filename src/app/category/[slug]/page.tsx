import { news } from "@/data/news";
import { notFound } from "next/navigation";

import Header from "@/components/Header";
import NewsCard from "@/components/NewsCard";
import SectionTitle from "@/components/SectionTitle";

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
   أسماء التصنيفات
========================================================= */

const categoriesMap: Record<string, string> = {

  politics: "سياسة",

  economy: "اقتصاد",

  technology: "تكنولوجيا",

  culture: "ثقافة",

};

/* =========================================================
   Dynamic SEO
========================================================= */

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {

  const { slug } = await params;

  const categoryName = categoriesMap[slug];

  if (!categoryName) {

    return {
      title: "التصنيف غير موجود",
    };

  }

  return {

    title: `${categoryName} | Maalam.net`,

    description:
      `آخر أخبار ${categoryName} المحلية والعالمية من منصة Maalam.net`,

    alternates: {
      canonical: `https://maalam.net/category/${slug}`,
    },

    openGraph: {

      title: `${categoryName} | Maalam.net`,

      description:
        `آخر أخبار ${categoryName} المحلية والعالمية من منصة Maalam.net`,

      url: `https://maalam.net/category/${slug}`,

      type: "website",
    },

  };

}

/* =========================================================
   صفحة التصنيف
========================================================= */

export default async function CategoryPage({
  params,
}: Props) {

  /* =====================================================
     جلب الـ slug
  ===================================================== */

  const { slug } = await params;

  /* =====================================================
     اسم التصنيف بالعربي
  ===================================================== */

  const categoryName = categoriesMap[slug];

  /* =====================================================
     إذا التصنيف غير موجود
  ===================================================== */

  if (!categoryName) {
    notFound();
  }

  /* =====================================================
     أخبار التصنيف
  ===================================================== */

  const categoryNews = news.filter(
    (item) => item.category === categoryName
  );

  return (

    <main className="bg-black text-white min-h-screen">

      {/* =================================================
         الهيدر
      ================================================= */}

      <Header
      />

      {/* =================================================
         عنوان الصفحة
      ================================================= */}

      <section className="w-full px-4 md:px-8 pt-14 pb-10">

        <div className="max-w-7xl mx-auto">

          <SectionTitle
            title={categoryName}
            color={
              categoryName === "سياسة"
                ? "bg-red-500"

                : categoryName === "اقتصاد"
                ? "bg-sky-400"

                : categoryName === "تكنولوجيا"
                ? "bg-indigo-400"

                : "bg-green-500"
            }
          />

        </div>

      </section>

      {/* =================================================
         أخبار التصنيف
      ================================================= */}

      <section className="w-full px-4 md:px-8 pb-24">

        <div className="max-w-7xl mx-auto">

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

            {categoryNews.map((item) => (

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
