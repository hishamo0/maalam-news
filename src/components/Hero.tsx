import { news } from "@/data/news";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {

  const heroArticle = news[0];

  return (

    <section className="w-full px-4 py-20">

      <div className="
        bg-zinc-900
        overflow-hidden
        group
      ">

        <Link href={`/article/${heroArticle.slug}`}>

          <div className="overflow-hidden">

            <Image
              src={heroArticle.image}
              alt={heroArticle.title}
              width={1400}
              height={800}
              className="
                w-full
                h-[350px]
                md:h-[550px]
                object-cover
                transition-transform
                duration-700
                group-hover:scale-105
              "
            />

          </div>

          <div className="p-6 md:p-10">

            <span className="
              text-red-500
              font-semibold
              text-lg
            ">
              {heroArticle.category}
            </span>

            <h1 className="
              text-3xl
              md:text-7xl
              font-extrabold
              leading-tight
              mt-6
            ">

              {heroArticle.title}

            </h1>

            <p className="
              text-zinc-400
              text-lg
              md:text-xl
              leading-relaxed
              mt-8
              max-w-3xl
            ">

              {heroArticle.excerpt}

            </p>

          </div>

        </Link>

      </div>

    </section>

  );
}