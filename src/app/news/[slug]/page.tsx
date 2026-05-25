import { news } from "@/data/news";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Image from "next/image";

type Props = {
  params: {
    slug: string;
  };
};
export async function generateMetadata({ params }: Props) {

  const article = news.find(
    (a) => a.slug === params.slug
  );

  if (!article) {
    return {
      title: "مقال غير موجود",
    };
  }

  return {
    title: article.title,
    description: article.description,
  };
}
export default function ArticlePage({ params }: Props) {

  const article = news.find(
    (a) => a.slug === params.slug
  );

  if (!article) {
    notFound();
  }

  return (
    <main className="bg-black text-white min-h-screen">

      <Header search="" setSearch={() => {}} />

      <article className="max-w-5xl mx-auto px-4 py-10">

        <div className="relative w-full h-[500px] overflow-hidden rounded-3xl">

          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover"
          />

        </div>

        <div className="mt-8">

          <span className="text-red-500 text-sm font-bold">
            {article.category}
          </span>

          <h1 className="text-5xl font-extrabold leading-tight mt-4">
            {article.title}
          </h1>

          <p className="text-zinc-500 mt-4">
            {article.date}
          </p>

  <div className="mt-10">

  <div
    className="
      prose
      prose-invert
      prose-h2:text-white
      prose-p:text-zinc-200
      prose-li:text-zinc-200
      max-w-none
      leading-8
    "
    dangerouslySetInnerHTML={{
      __html: article.content || "",
    }}
  />

  </div>

        </div>

      </article>

    </main>
  );
}