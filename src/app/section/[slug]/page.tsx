import { news } from "@/data/news";
import Link from "next/link";
import Image from "next/image";

type SectionPageProps = {
  params: {
    slug: string;
  };
};

export default async function SectionPage({
  params,
}: SectionPageProps) {

const { slug } = params;

const sectionNews = news.filter(
  (item) => item.category === decodeURIComponent(slug)
);

  if (sectionNews.length === 0) {
    return (

      <main className="
        min-h-screen
        bg-black
        text-white
        flex
        items-center
        justify-center
      ">

        <h1 className="text-4xl font-bold">
          القسم غير موجود
        </h1>

      </main>

    );
  }

  return (

    <main className="
      min-h-screen
      bg-black
      text-white
      px-4
      md:px-8
      py-16
    ">

      <div className="max-w-7xl mx-auto">

        <h1 className="
          text-5xl
          md:text-6xl
          font-extrabold
          mb-16
        ">

          {sectionNews[0].category}

        </h1>

        <div className="
          grid
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-3
          gap-10
        ">

          {sectionNews.map((item) => (

            <Link
              key={item.slug}
              href={`/news/${item.slug}`}
              className="
                bg-zinc-900
                overflow-hidden
                hover:bg-zinc-800
                transition
                group
              "
            >

              <Image
                src={item.image}
                alt={item.title}
                width={1200}
                height={700}
                className="
                  w-full
                  h-64
                  object-cover
                  transition-transform
                  duration-500
                  group-hover:scale-105
                "
              />

              <div className="p-6">

                <span className="
                  text-red-500
                  text-sm
                  font-bold
                ">
                  {item.category}
                </span>

                <h2 className="
                  text-2xl
                  font-bold
                  leading-relaxed
                  mt-4
                ">
                  {item.title}
                </h2>

              </div>

            </Link>

          ))}

        </div>

      </div>

    </main>

  );
}
