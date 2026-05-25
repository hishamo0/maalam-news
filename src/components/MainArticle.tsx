import { news } from "@/data/news";
import Link from "next/link";
import Image from "next/image";

export default function MainArticle() {

  const article = news[0];

  return (

    <Link href={`/news/${article.slug}`}>

      <article className="bg-zinc-900 overflow-hidden group rounded-3xl">

        <div className="overflow-hidden">

          <Image
            src={article.image}
            alt={article.title}
            width={1200}
            height={700}
            className="
              w-full
              h-[500px]
              object-cover
              transition-transform
              duration-700
              group-hover:scale-105
            "
          />

        </div>

        <div className="p-8">

          <span className="text-red-500 text-sm font-semibold">
            {article.category}
          </span>

          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mt-5">
            {article.title}
          </h2>

          <p className="text-zinc-400 text-lg leading-relaxed mt-6">
            {article.excerpt}
          </p>

        </div>

      </article>

    </Link>
  );
}