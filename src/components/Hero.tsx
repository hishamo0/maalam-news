import { news } from "@/data/news";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {

  /* =====================================================
     المقال الرئيسي
  ===================================================== */

  const heroArticle = news[0];

  /* =====================================================
     الأخبار الجانبية
  ===================================================== */

  const sideArticles = news.slice(1, 3);

  return (

    <section className="w-full px-4 py-10">

      {/* =================================================
         Grid Layout
      ================================================= */}

      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-3
          gap-6
        "
      >

        {/* =============================================
           المقال الرئيسي
        ============================================== */}

        <div
          className="
            xl:col-span-2
            bg-zinc-900
            overflow-hidden
            group
            rounded-3xl
          "
        >

          <Link href={`/news/${heroArticle.slug}`}>

            {/* الصورة */}

            <div className="overflow-hidden">

              <Image
                src={heroArticle.image}
                alt={heroArticle.title}
                width={1400}
                height={800}
                priority
                className="
                  w-full
                  h-[320px]
                  md:h-[500px]
                  object-cover
                  transition-transform
                  duration-700
                  group-hover:scale-105
                "
              />

            </div>

            {/* المحتوى */}

            <div className="p-6 md:p-10">

              <span
                className="
                  text-red-500
                  font-semibold
                  text-lg
                "
              >

                {heroArticle.category}

              </span>

              <h1
                className="
                  text-3xl
                  md:text-6xl
                  font-extrabold
                  leading-tight
                  mt-6
                "
              >

                {heroArticle.title}

              </h1>

              <p
                className="
                  text-zinc-400
                  text-lg
                  md:text-xl
                  leading-relaxed
                  mt-8
                  max-w-3xl
                "
              >

                {heroArticle.excerpt}

              </p>

            </div>

          </Link>

        </div>

        {/* =============================================
           الأخبار الجانبية
        ============================================== */}

        <div
          className="
            flex
            flex-col
            gap-6
          "
        >

          {sideArticles.map((article) => (

            <Link
              key={article.slug}
              href={`/news/${article.slug}`}
              className="
                bg-zinc-900
                rounded-3xl
                overflow-hidden
                group
                flex-1
              "
            >

              {/* الصورة */}

              <div className="overflow-hidden">

                <Image
                  src={article.image}
                  alt={article.title}
                  width={800}
                  height={500}
                  className="
                    w-full
                    h-[220px]
                    object-cover
                    transition-transform
                    duration-700
                    group-hover:scale-105
                  "
                />

              </div>

              {/* المحتوى */}

              <div className="p-5">

                <span
                  className="
                    text-red-500
                    text-sm
                    font-semibold
                  "
                >

                  {article.category}

                </span>

                <h2
                  className="
                    text-2xl
                    font-bold
                    leading-tight
                    mt-4
                    transition-colors
                    duration-300
                    group-hover:text-red-500
                  "
                >

                  {article.title}

                </h2>

              </div>

            </Link>

          ))}

        </div>

      </div>

    </section>

  );

}