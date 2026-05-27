import Header from "@/components/Header";
import { news } from "@/data/news";
import NewsCard from "@/components/NewsCard";

/* =========================================================
   نوع البيانات القادمة من الرابط
========================================================= */

type Props = {
  searchParams: Promise<{
    q?: string;
  }>;
};

/* =========================================================
   صفحة نتائج البحث
========================================================= */

export default async function SearchPage({
  searchParams,
}: Props) {

  // استخراج كلمة البحث من الرابط
  const { q = "" } = await searchParams;

  // تحويل النص إلى lowercase للمقارنة
  const query = q.toLowerCase();

  /* =======================================================
     فلترة الأخبار
  ======================================================= */

  const results = news.filter((item) =>

    item.title.toLowerCase().includes(query) ||

    item.excerpt.toLowerCase().includes(query)

  );

  return (

    <main className="bg-black text-white min-h-screen">

      {/* ===================================================
         الهيدر
      =================================================== */}

      <Header />

      {/* ===================================================
         نتائج البحث
      =================================================== */}

      <section className="px-4 md:px-8 pt-24 pb-12">

        <div className="max-w-7xl mx-auto">

          {/* عنوان الصفحة */}

          <h1 className="text-3xl font-extrabold mb-10">

            نتائج البحث عن:

            <span className="text-red-500">
              {" "}{q}
            </span>

          </h1>

          {/* إذا لا توجد نتائج */}

          {results.length === 0 ? (

            <p className="text-zinc-400">

              لا توجد نتائج مطابقة.

            </p>

          ) : (

            /* عرض النتائج */

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

              {results.map((item) => (

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

          )}

        </div>

      </section>

    </main>

  );

}